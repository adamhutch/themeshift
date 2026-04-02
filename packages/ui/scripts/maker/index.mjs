import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import prompts from 'prompts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const templatesDir = path.join(__dirname, 'templates');

const mode = process.argv[2];

const MODE_CONFIG = {
  component: {
    message: 'Component name',
    validate: validatePascalCase,
    run: makeComponent,
  },
  icon: {
    message: 'Icon name',
    validate: validatePascalCase,
    run: makeIcon,
  },
  tokens: {
    message: 'Token path',
    validate: validateTokenPath,
    run: makeTokens,
  },
};

async function main() {
  const config = MODE_CONFIG[mode];

  if (!config) {
    exitWithError(`Unknown maker mode: ${mode}`);
  }

  const response = await prompts(
    {
      type: 'text',
      name: 'value',
      message: config.message,
      validate: config.validate,
    },
    {
      onCancel: () => {
        exitWithError('No name provided.');
      },
    },
  );

  const value = response.value?.trim();

  if (!value) {
    exitWithError('No name provided.');
  }

  const changedPaths = await config.run(value);

  console.log(`Created ${mode} scaffold: ${value}`);

  for (const changedPath of changedPaths) {
    console.log(path.resolve(changedPath));
  }
}

function validatePascalCase(value) {
  if (!value?.trim()) {
    return 'A name is required.';
  }

  if (!/^[A-Z][A-Za-z0-9]*$/.test(value.trim())) {
    return 'Use PascalCase with letters and numbers only.';
  }

  return true;
}

function validateTokenPath(value) {
  if (!value?.trim()) {
    return 'A token path is required.';
  }

  if (!/^[a-z0-9-]+(?:\/[a-z0-9-]+)*$/.test(value.trim())) {
    return 'Use lowercase path segments with letters, numbers, or hyphens.';
  }

  return true;
}

async function makeComponent(name) {
  const uiDir = path.join(rootDir, 'src/ui', name);
  const uiIndexPath = path.join(uiDir, 'index.tsx');
  const uiStylesPath = path.join(uiDir, `${name}.module.scss`);
  const wrapperDir = path.join(rootDir, 'src/components', name);
  const wrapperPath = path.join(wrapperDir, 'index.ts');

  await ensureDoesNotExist(uiDir, `Component already exists: ${name}`);
  await ensureDoesNotExist(wrapperDir, `Component wrapper already exists: ${name}`);

  await fs.mkdir(uiDir, { recursive: true });
  await fs.mkdir(wrapperDir, { recursive: true });

  const componentTemplate = await readTemplate('component-index.tsx.template');
  const componentSource = componentTemplate
    .replaceAll('__NAME__', name)
    .replaceAll('__SCSS_FILE__', `${name}.module.scss`);

  await fs.writeFile(uiIndexPath, componentSource);
  await fs.writeFile(uiStylesPath, '');
  await fs.writeFile(wrapperPath, `export * from '../../ui/${name}';\n`);

  await rewriteUiBarrel();
  await rewritePackageExports();
  await rewriteComponentEntries();

  return [
    uiIndexPath,
    uiStylesPath,
    wrapperPath,
    path.join(rootDir, 'src/ui/index.ts'),
    path.join(rootDir, 'package.json'),
    path.join(rootDir, 'vite.config.components.ts'),
  ];
}

async function makeIcon(name) {
  const iconPath = path.join(rootDir, 'src/icons', `Icon${name}.tsx`);

  await ensureDoesNotExist(iconPath, `Icon already exists: Icon${name}`);

  const iconTemplate = await readTemplate('icon.tsx.template');
  const iconSource = iconTemplate.replaceAll('__NAME__', name);

  await fs.writeFile(iconPath, iconSource);
  await rewriteIconsBarrel();

  return [iconPath, path.join(rootDir, 'src/icons/index.ts')];
}

async function makeTokens(tokenPath) {
  const filePath = path.join(rootDir, 'tokens', `${tokenPath}.json`);

  await ensureDoesNotExist(filePath, `Token file already exists: ${tokenPath}.json`);

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(makeTokenObject(tokenPath), null, 2)}\n`);

  return [filePath];
}

async function rewriteUiBarrel() {
  const uiRoot = path.join(rootDir, 'src/ui');
  const entries = await fs.readdir(uiRoot, { withFileTypes: true });
  const exports = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => `export * from './${entry.name}';`)
    .sort();

  await fs.writeFile(path.join(uiRoot, 'index.ts'), `${exports.join('\n')}\n`);
}

async function rewriteIconsBarrel() {
  const iconsRoot = path.join(rootDir, 'src/icons');
  const entries = await fs.readdir(iconsRoot, { withFileTypes: true });
  const exports = entries
    .filter(
      (entry) =>
        entry.isFile() &&
        /^Icon[A-Z][A-Za-z0-9]*\.tsx$/.test(entry.name),
    )
    .map((entry) => `export * from './${entry.name.replace(/\.tsx$/, '')}';`)
    .sort();

  await fs.writeFile(path.join(iconsRoot, 'index.ts'), `${exports.join('\n')}\n`);
}

async function rewritePackageExports() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
  const componentNames = await listComponentNames();

  const existingExports = packageJson.exports ?? {};
  const nextExports = {};

  for (const name of componentNames) {
    nextExports[`./components/${name}`] = {
      types: `./dist/components/${name}/index.d.ts`,
      import: `./dist/components/${name}/index.js`,
    };
  }

  for (const [key, value] of Object.entries(existingExports)) {
    if (!key.startsWith('./components/')) {
      nextExports[key] = value;
    }
  }

  packageJson.exports = Object.fromEntries(
    Object.entries(nextExports).sort(([left], [right]) => left.localeCompare(right)),
  );

  await fs.writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

async function rewriteComponentEntries() {
  const configPath = path.join(rootDir, 'vite.config.components.ts');
  const source = await fs.readFile(configPath, 'utf8');
  const componentNames = await listComponentNames();

  const entryBlock = componentNames
    .map(
      (name) => `        'components/${name}/index': fileURLToPath(
          new URL('./src/components/${name}/index.ts', import.meta.url),
        ),`,
    )
    .join('\n');

  const nextSource = source.replace(
    /entry:\s*\{[\s\S]*?\n\s*\},\n\s*formats:/,
    `entry: {\n${entryBlock}\n      },\n      formats:`,
  );

  await fs.writeFile(configPath, nextSource);
}

async function listComponentNames() {
  const componentsRoot = path.join(rootDir, 'src/components');
  const entries = await fs.readdir(componentsRoot, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function makeTokenObject(tokenPath) {
  const segments = tokenPath.split('/');
  const leafKey = segments.pop();

  let current = { [leafKey]: { '': '' } };

  while (segments.length > 0) {
    const segment = segments.pop();
    current = { [segment]: current };
  }

  return current;
}

async function readTemplate(templateName) {
  return fs.readFile(path.join(templatesDir, templateName), 'utf8');
}

async function ensureDoesNotExist(targetPath, message) {
  try {
    await fs.access(targetPath);
    exitWithError(message);
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return;
    }

    throw error;
  }
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}

await main();

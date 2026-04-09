import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'packages/ui/src/components');
const readmePath = path.join(rootDir, 'packages/ui/README.md');
const badgePattern =
  /!\[Components\]\(https:\/\/img\.shields\.io\/badge\/components-\d+-blue\.svg\)/;
const check = process.argv.includes('--check');

async function hasIndexFile(componentName) {
  try {
    const indexPath = path.join(componentsDir, componentName, 'index.tsx');
    const indexStat = await stat(indexPath);

    return indexStat.isFile();
  } catch {
    return false;
  }
}

async function countComponents() {
  const entries = await readdir(componentsDir, { withFileTypes: true });
  const componentDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const componentChecks = await Promise.all(
    componentDirectories.map(hasIndexFile)
  );

  return componentChecks.filter(Boolean).length;
}

const componentCount = await countComponents();
const readme = await readFile(readmePath, 'utf8');
const nextBadge = `![Components](https://img.shields.io/badge/components-${componentCount}-blue.svg)`;

if (!badgePattern.test(readme)) {
  throw new Error(
    'Could not find the components badge in packages/ui/README.md'
  );
}

const nextReadme = readme.replace(badgePattern, nextBadge);

if (check) {
  if (nextReadme !== readme) {
    throw new Error(
      `packages/ui/README.md has a stale components badge. Expected: ${nextBadge}`
    );
  }

  console.log(`UI component badge is up to date: ${componentCount}`);
} else {
  await writeFile(readmePath, nextReadme);
  console.log(`Updated UI component badge to ${componentCount}`);
}

import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const componentsDir = path.join(rootDir, 'packages/ui/src/components');
const readmePaths = [
  path.join(rootDir, 'README.md'),
  path.join(rootDir, 'packages/ui/README.md'),
];
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
const nextBadge = `![Components](https://img.shields.io/badge/components-${componentCount}-blue.svg)`;

for (const readmePath of readmePaths) {
  const readme = await readFile(readmePath, 'utf8');
  const relativeReadmePath = path.relative(rootDir, readmePath);

  if (!badgePattern.test(readme)) {
    throw new Error(
      `Could not find the components badge in ${relativeReadmePath}`
    );
  }

  const nextReadme = readme.replace(badgePattern, nextBadge);

  if (check) {
    if (nextReadme !== readme) {
      throw new Error(
        `${relativeReadmePath} has a stale components badge. Expected: ${nextBadge}`
      );
    }

    continue;
  }

  await writeFile(readmePath, nextReadme);
}

console.log(
  check
    ? `UI component badges are up to date: ${componentCount}`
    : `Updated UI component badges to ${componentCount}`
);

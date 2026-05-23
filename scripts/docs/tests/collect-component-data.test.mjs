import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { runCollectComponentData } from '../collect-component-data.core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixtureRoot = path.join(__dirname, 'fixtures/workspace');
const fixtureSnapshotPath = path.join(
  __dirname,
  'fixtures/component-data.fixture.snapshot.json'
);
const repoRoot = path.resolve(__dirname, '../../..');
const workspaceOutputPath = path.join(
  repoRoot,
  'apps/ui-app/src/apiReference/generated/components.ts'
);

async function collectFixtureData() {
  return runCollectComponentData({
    log: false,
    rootDir: fixtureRoot,
    syncBadges: false,
    writeOutput: false,
  });
}

test('collect-component-data fixture snapshot and invariants', async () => {
  const { componentData, output } = await collectFixtureData();
  const expectedFixtureData = JSON.parse(
    await readFile(fixtureSnapshotPath, 'utf8')
  );

  assert.deepEqual(componentData, expectedFixtureData);
  assert.match(output, /export const components =/);

  const alpha = componentData.find((component) => component.name === 'Alpha');
  assert.ok(alpha);
  assert.equal(alpha.meta?.type, 'component');
  assert.equal(alpha.routeSlug, 'alpha');
  assert.equal(alpha.slug, 'alpha');

  const alphaTone = alpha.typesReference.find(
    (typeRef) => typeRef.typeName === 'AlphaTone'
  );
  assert.ok(alphaTone);
  assert.deepEqual(alphaTone.values, ['neutral', 'brand']);
});

test('collect-component-data discovers compound Object.assign targets', async () => {
  const { componentData } = await collectFixtureData();
  const compound = componentData.find(
    (component) => component.name === 'Compound'
  );

  assert.ok(compound);

  const displayNames = [
    ...new Set(compound.apiReference.map((item) => item.displayName)),
  ].sort((first, second) => first.localeCompare(second));

  assert.deepEqual(displayNames, ['Compound', 'Compound.Label']);

  const asChildItem = compound.apiReference.find(
    (item) => item.displayName === 'Compound' && item.propName === 'asChild'
  );

  assert.ok(asChildItem);
  assert.equal(asChildItem.defaultValue, null);
  assert.deepEqual(asChildItem.values, []);
});

test('collect-component-data filters and sorts exported indexed components', async () => {
  const { componentData, componentNames } = await collectFixtureData();

  assert.deepEqual(componentNames, ['Alpha', 'Compound', 'Zebra']);
  assert.deepEqual(
    componentData.map((component) => component.name),
    ['Alpha', 'Compound', 'Zebra']
  );
});

test('collect-component-data workspace smoke output matches generated file', async () => {
  const { output } = await runCollectComponentData({
    log: false,
    rootDir: repoRoot,
    syncBadges: false,
    writeOutput: false,
  });
  const expectedOutput = await readFile(workspaceOutputPath, 'utf8');

  assert.equal(output, expectedOutput);
});

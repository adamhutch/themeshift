import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import prettier from 'prettier';
import ts from 'typescript';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const hooksDir = path.join(rootDir, 'packages/ui/src/hooks');
const outputPath = path.join(rootDir, 'apps/ui-app/src/hook-data/generated.ts');
const packageJsonPath = path.join(rootDir, 'packages/ui/package.json');
const tsConfigPath = path.join(rootDir, 'packages/ui/tsconfig.build.json');
const sourceCodeUrlBase =
  'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/hooks';

function normalizePath(filePath) {
  return path.normalize(filePath);
}

async function hasIndexFile(hookName) {
  try {
    const indexPath = path.join(hooksDir, hookName, 'index.ts');
    const indexStat = await stat(indexPath);

    return indexStat.isFile();
  } catch {
    return false;
  }
}

async function getHookNames() {
  const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf8'));
  const exportKeys = Object.keys(packageJson.exports ?? {});
  const exportedHookNames = exportKeys
    .filter((key) => key.startsWith('./hooks/'))
    .map((key) => key.replace('./hooks/', ''))
    .filter((hookName) => hookName.length > 0 && !hookName.includes('/'));
  const uniqueExportedHookNames = [...new Set(exportedHookNames)];
  const entries = await readdir(hooksDir, { withFileTypes: true });
  const hookDirectories = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const hookNamesToCheck = hookDirectories.filter((hookName) =>
    uniqueExportedHookNames.includes(hookName)
  );
  const hookChecks = await Promise.all(
    hookNamesToCheck.map(async (hookName) => ({
      hookName,
      hasIndexFile: await hasIndexFile(hookName),
      isExported: uniqueExportedHookNames.includes(hookName),
    }))
  );

  return hookChecks
    .filter(({ hasIndexFile, isExported }) => hasIndexFile && isExported)
    .map(({ hookName }) => hookName)
    .sort((first, second) => first.localeCompare(second));
}

function createProgram() {
  const configFile = ts.readConfigFile(tsConfigPath, ts.sys.readFile);

  if (configFile.error) {
    throw new Error(
      ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n')
    );
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(tsConfigPath)
  );

  return ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
}

function createAnalyzer(program) {
  const sourceFiles = program
    .getSourceFiles()
    .filter((sourceFile) =>
      normalizePath(sourceFile.fileName).startsWith(normalizePath(hooksDir))
    );

  return {
    collectApiReference(hookName) {
      const hookSourceFiles = sourceFiles.filter((sourceFile) =>
        normalizePath(sourceFile.fileName).startsWith(
          normalizePath(path.join(hooksDir, hookName))
        )
      );

      const declarations = getLocalTypeDeclarations(hookSourceFiles);
      const hookFunction = findExportedHookFunction(hookName, hookSourceFiles);

      if (!hookFunction) {
        return [];
      }

      const defaults = collectHookDefaults(hookFunction);
      const optionsTypeName = getHookOptionsTypeName(hookFunction);

      if (!optionsTypeName) {
        return [];
      }

      return collectTargetOptions({
        declarations,
        defaults,
        displayName: hookName,
        optionsTypeName,
      });
    },
  };
}

function findExportedHookFunction(hookName, sourceFiles) {
  for (const sourceFile of sourceFiles) {
    let found = null;

    ts.forEachChild(sourceFile, (node) => {
      if (found) {
        return;
      }

      if (
        ts.isFunctionDeclaration(node) &&
        node.name &&
        ts.isIdentifier(node.name) &&
        node.name.text === hookName &&
        node.modifiers?.some(
          (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
        )
      ) {
        found = node;
      }
    });

    if (found) {
      return found;
    }
  }

  return null;
}

function getHookOptionsTypeName(hookFunction) {
  const optionsParameter = hookFunction.parameters[0];

  if (!optionsParameter?.type) {
    return null;
  }

  if (ts.isTypeReferenceNode(optionsParameter.type)) {
    return getEntityNameText(optionsParameter.type.typeName);
  }

  return null;
}

function getEntityNameText(name) {
  if (ts.isIdentifier(name)) {
    return name.text;
  }

  if (ts.isQualifiedName(name)) {
    return `${getEntityNameText(name.left)}.${name.right.text}`;
  }

  return '';
}

function getLocalTypeDeclarations(sourceFiles) {
  const declarations = new Map();

  for (const sourceFile of sourceFiles) {
    ts.forEachChild(sourceFile, function visit(node) {
      if (
        (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) &&
        ts.isIdentifier(node.name)
      ) {
        declarations.set(node.name.text, node);
      }

      ts.forEachChild(node, visit);
    });
  }

  return declarations;
}

function collectHookDefaults(hookFunction) {
  const defaults = new Map();
  const optionsParameter = hookFunction.parameters[0];

  if (!optionsParameter?.name) {
    return defaults;
  }

  if (!ts.isObjectBindingPattern(optionsParameter.name)) {
    return defaults;
  }

  for (const element of optionsParameter.name.elements) {
    const propName = getBindingElementName(element);

    if (propName && element.initializer) {
      defaults.set(propName, formatDefaultValue(element.initializer));
    }
  }

  return defaults;
}

function getBindingElementName(element) {
  const name = element.propertyName ?? element.name;

  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function formatDefaultValue(expression) {
  if (
    ts.isStringLiteral(expression) ||
    ts.isNoSubstitutionTemplateLiteral(expression)
  ) {
    return expression.text;
  }

  if (ts.isNumericLiteral(expression)) {
    return Number(expression.text);
  }

  if (expression.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (expression.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (
    ts.isArrayLiteralExpression(expression) ||
    ts.isArrowFunction(expression) ||
    ts.isCallExpression(expression) ||
    ts.isFunctionExpression(expression) ||
    ts.isNewExpression(expression) ||
    ts.isObjectLiteralExpression(expression)
  ) {
    return 'object';
  }

  if (
    ts.isPrefixUnaryExpression(expression) &&
    ts.isNumericLiteral(expression.operand)
  ) {
    return expression.operator === ts.SyntaxKind.MinusToken
      ? -Number(expression.operand.text)
      : Number(expression.operand.text);
  }

  return null;
}

function getPropertyName(name) {
  if (ts.isIdentifier(name) || ts.isStringLiteral(name)) {
    return name.text;
  }

  return null;
}

function getJsDocText(node) {
  const docs = node.jsDoc;

  if (!docs || docs.length === 0) {
    return '';
  }

  const parts = [];

  for (const doc of docs) {
    if (!doc.comment) {
      continue;
    }

    if (typeof doc.comment === 'string') {
      parts.push(doc.comment);
      continue;
    }

    parts.push(
      doc.comment
        .map((part) => ('text' in part ? part.text : ''))
        .join('')
        .trim()
    );
  }

  return parts.join('\n\n').trim();
}

function getLiteralUnionValues(typeNode) {
  if (!typeNode || !ts.isUnionTypeNode(typeNode)) {
    return [];
  }

  const values = [];

  for (const unionMember of typeNode.types) {
    if (!ts.isLiteralTypeNode(unionMember)) {
      continue;
    }

    const literal = unionMember.literal;

    if (ts.isStringLiteral(literal)) {
      values.push(literal.text);
    } else if (ts.isNumericLiteral(literal)) {
      values.push(Number(literal.text));
    } else if (literal.kind === ts.SyntaxKind.TrueKeyword) {
      values.push(true);
    } else if (literal.kind === ts.SyntaxKind.FalseKeyword) {
      values.push(false);
    }
  }

  return values;
}

function getTypeText(typeNode) {
  if (!typeNode) {
    return 'unknown';
  }

  const keywordTypes = {
    [ts.SyntaxKind.AnyKeyword]: 'any',
    [ts.SyntaxKind.BigIntKeyword]: 'bigint',
    [ts.SyntaxKind.BooleanKeyword]: 'boolean',
    [ts.SyntaxKind.NeverKeyword]: 'never',
    [ts.SyntaxKind.NullKeyword]: 'null',
    [ts.SyntaxKind.NumberKeyword]: 'number',
    [ts.SyntaxKind.ObjectKeyword]: 'object',
    [ts.SyntaxKind.StringKeyword]: 'string',
    [ts.SyntaxKind.SymbolKeyword]: 'symbol',
    [ts.SyntaxKind.UndefinedKeyword]: 'undefined',
    [ts.SyntaxKind.UnknownKeyword]: 'unknown',
    [ts.SyntaxKind.VoidKeyword]: 'void',
  };

  if (typeNode.kind in keywordTypes) {
    return keywordTypes[typeNode.kind];
  }

  try {
    return typeNode.getText(typeNode.getSourceFile());
  } catch {
    return 'unknown';
  }
}

function collectTargetOptions({
  declarations,
  defaults,
  displayName,
  optionsTypeName,
}) {
  const optionMap = new Map();

  collectTypeName({
    declarations,
    displayName,
    optionMap,
    typeName: optionsTypeName,
    visited: new Set(),
  });

  for (const item of optionMap.values()) {
    item.defaultValue = defaults.get(item.propName) ?? null;
  }

  return [...optionMap.values()].sort((first, second) =>
    first.propName.localeCompare(second.propName)
  );
}

function collectTypeName({
  declarations,
  displayName,
  optionMap,
  typeName,
  visited,
}) {
  const declaration = declarations.get(typeName);

  if (!declaration || visited.has(typeName)) {
    return;
  }

  visited.add(typeName);

  if (ts.isInterfaceDeclaration(declaration)) {
    collectMembers({
      declarations,
      displayName,
      members: declaration.members,
      optionMap,
      visited,
    });
  }

  if (ts.isTypeAliasDeclaration(declaration)) {
    collectTypeNode({
      declarations,
      displayName,
      optionMap,
      typeNode: declaration.type,
      visited,
    });
  }

  visited.delete(typeName);
}

function collectTypeNode({
  declarations,
  displayName,
  optionMap,
  typeNode,
  visited,
}) {
  if (!typeNode) {
    return;
  }

  if (ts.isParenthesizedTypeNode(typeNode)) {
    collectTypeNode({
      declarations,
      displayName,
      optionMap,
      typeNode: typeNode.type,
      visited,
    });
    return;
  }

  if (ts.isTypeLiteralNode(typeNode)) {
    collectMembers({
      declarations,
      displayName,
      members: typeNode.members,
      optionMap,
      visited,
    });
    return;
  }

  if (ts.isIntersectionTypeNode(typeNode)) {
    for (const part of typeNode.types) {
      collectTypeNode({
        declarations,
        displayName,
        optionMap,
        typeNode: part,
        visited,
      });
    }
    return;
  }

  if (ts.isTypeReferenceNode(typeNode)) {
    collectTypeName({
      declarations,
      displayName,
      optionMap,
      typeName: getEntityNameText(typeNode.typeName),
      visited,
    });
  }
}

function collectMembers({
  declarations,
  displayName,
  members,
  optionMap,
  visited,
}) {
  for (const member of members) {
    if (!ts.isPropertySignature(member)) {
      continue;
    }

    const propName = member.name ? getPropertyName(member.name) : null;

    if (!propName) {
      continue;
    }

    optionMap.set(propName, {
      comments: getJsDocText(member),
      defaultValue: null,
      displayName,
      propName,
      type: getTypeText(member.type),
      values: getLiteralUnionValues(member.type),
    });
  }
}

async function readHookMeta(hookName) {
  const metaPath = path.join(hooksDir, hookName, `${hookName}.meta.ts`);

  try {
    const sourceText = await readFile(metaPath, 'utf8');
    const sourceFile = ts.createSourceFile(
      metaPath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    return getMetaFromSourceFile(sourceFile);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'ENOENT'
    ) {
      return null;
    }

    throw error;
  }
}

function getMetaFromSourceFile(sourceFile) {
  let meta = null;

  ts.forEachChild(sourceFile, (node) => {
    if (
      !ts.isVariableStatement(node) ||
      !node.modifiers?.some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
      )
    ) {
      return;
    }

    for (const declaration of node.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== 'meta'
      ) {
        continue;
      }

      if (!declaration.initializer) {
        throw new Error(
          `Found exported meta in ${sourceFile.fileName}, but it has no initializer.`
        );
      }

      meta = evaluateMetaExpression(
        declaration.initializer,
        sourceFile.fileName
      );
    }
  });

  return meta;
}

function unwrapExpression(expression) {
  if (
    ts.isAsExpression(expression) ||
    ts.isSatisfiesExpression(expression) ||
    ts.isParenthesizedExpression(expression)
  ) {
    return unwrapExpression(expression.expression);
  }

  return expression;
}

function evaluateMetaExpression(expression, filePath) {
  const unwrapped = unwrapExpression(expression);

  if (!ts.isObjectLiteralExpression(unwrapped)) {
    throw new Error(
      `Expected exported meta in ${filePath} to be an object literal.`
    );
  }

  return evaluateObjectLiteral(unwrapped, filePath);
}

function evaluateObjectLiteral(node, filePath) {
  const result = {};

  for (const property of node.properties) {
    if (ts.isPropertyAssignment(property)) {
      const key = getPropertyName(property.name);

      if (!key) {
        throw new Error(`Unsupported meta property name in ${filePath}.`);
      }

      result[key] = evaluateMetaValue(property.initializer, filePath);
      continue;
    }

    if (ts.isShorthandPropertyAssignment(property)) {
      throw new Error(
        `Shorthand properties are not supported in meta files: ${filePath}`
      );
    }

    throw new Error(`Unsupported property syntax in meta file: ${filePath}`);
  }

  return result;
}

function evaluateMetaValue(expression, filePath) {
  const unwrapped = unwrapExpression(expression);

  if (
    ts.isStringLiteral(unwrapped) ||
    ts.isNoSubstitutionTemplateLiteral(unwrapped)
  ) {
    return unwrapped.text;
  }

  if (ts.isNumericLiteral(unwrapped)) {
    return Number(unwrapped.text);
  }

  if (unwrapped.kind === ts.SyntaxKind.TrueKeyword) {
    return true;
  }

  if (unwrapped.kind === ts.SyntaxKind.FalseKeyword) {
    return false;
  }

  if (unwrapped.kind === ts.SyntaxKind.NullKeyword) {
    return null;
  }

  if (ts.isArrayLiteralExpression(unwrapped)) {
    return unwrapped.elements.map((element) =>
      evaluateMetaValue(element, filePath)
    );
  }

  if (ts.isObjectLiteralExpression(unwrapped)) {
    return evaluateObjectLiteral(unwrapped, filePath);
  }

  if (
    ts.isPrefixUnaryExpression(unwrapped) &&
    ts.isNumericLiteral(unwrapped.operand)
  ) {
    return unwrapped.operator === ts.SyntaxKind.MinusToken
      ? -Number(unwrapped.operand.text)
      : Number(unwrapped.operand.text);
  }

  throw new Error(
    `Unsupported meta value in ${filePath}: ${unwrapped.getText()}`
  );
}

async function createHookData(hookName, analyzer) {
  const importPath = `@themeshift/ui/hooks/${hookName}`;

  return {
    apiReference: analyzer.collectApiReference(hookName),
    name: hookName,
    exportName: hookName,
    importPath,
    importString: `import { ${hookName} } from '${importPath}';`,
    meta: await readHookMeta(hookName),
    slug: hookName.toLowerCase(),
    routeSlug: hookName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
    sourceCodeUrl: `${sourceCodeUrlBase}/${hookName}`,
  };
}

async function createOutput(hookData) {
  const output = `import type { HookData } from './types';

export const hookData = ${JSON.stringify(hookData, null, 2)} satisfies HookData[];
`;

  return prettier.format(output, {
    parser: 'typescript',
    singleQuote: true,
    trailingComma: 'es5',
  });
}

const hookNames = await getHookNames();
const analyzer = createAnalyzer(createProgram());
const hookData = await Promise.all(
  hookNames.map((hookName) => createHookData(hookName, analyzer))
);

await writeFile(outputPath, await createOutput(hookData));

console.log(`Collected hook data for ${hookData.length} hooks`);

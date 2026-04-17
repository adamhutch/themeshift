import type { HookData } from './types';

export const hookData = [
  {
    apiReference: [
      {
        comments:
          'Specifies the amount of time, in milliseconds, before the\n`wasCopied` flag returns to false after a successful copy.',
        defaultValue: 2000,
        displayName: 'useCopyToClipboard',
        propName: 'clearDelay',
        type: 'number',
        values: [],
      },
    ],
    name: 'useCopyToClipboard',
    exportName: 'useCopyToClipboard',
    importPath: '@themeshift/ui/hooks/useCopyToClipboard',
    importString:
      "import { useCopyToClipboard } from '@themeshift/ui/hooks/useCopyToClipboard';",
    meta: {
      category: 'hooks',
      description:
        'Copies text to the clipboard and provides a transient `wasCopied` flag.',
      tags: ['clipboard', 'copy'],
      status: 'stable',
    },
    slug: 'usecopytoclipboard',
    routeSlug: 'use-copy-to-clipboard',
    sourceCodeUrl:
      'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/hooks/useCopyToClipboard',
  },
] satisfies HookData[];

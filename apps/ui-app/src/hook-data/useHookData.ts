import { useContext, useMemo } from 'react';

import { HookDataContext } from './HookDataContext';
import type { HookData } from './types';
import type { DocsCategory } from '@themeshift/docs-types';

type GroupedHooks = {
  key: DocsCategory | 'uncategorized';
  label: string;
  hooks: HookData[];
};

type UseHookDataValue = {
  hook: HookData | undefined;
  hooks: HookData[];
  groupedHooks: GroupedHooks[];
};

const CATEGORY_ORDER: Array<DocsCategory | 'uncategorized'> = [
  'hooks',
  'inputs-forms',
  'actions',
  'feedback-status',
  'data-display',
  'navigation-structure',
  'overlays',
  'layout-utilities',
  'templates-shells',
  'uncategorized',
];

const CATEGORY_LABELS: Record<DocsCategory | 'uncategorized', string> = {
  hooks: 'Hooks',
  'inputs-forms': 'Inputs & Forms',
  actions: 'Actions',
  'feedback-status': 'Feedback & Status',
  'data-display': 'Data Display',
  'navigation-structure': 'Navigation & Structure',
  overlays: 'Overlays',
  'layout-utilities': 'Layout & Utilities',
  'templates-shells': 'Templates & Shells',
  uncategorized: 'Uncategorized',
};

function sortHooks(a: HookData, b: HookData) {
  const aOrder = a.meta?.order ?? Number.POSITIVE_INFINITY;
  const bOrder = b.meta?.order ?? Number.POSITIVE_INFINITY;

  if (aOrder !== bOrder) {
    return aOrder - bOrder;
  }

  return a.name.localeCompare(b.name);
}

export function useHookData(slug?: string): UseHookDataValue {
  const context = useContext(HookDataContext);

  if (!context) {
    throw new Error('useHookData must be used within a HookDataProvider');
  }

  return useMemo(() => {
    const hook = slug
      ? context.hooks.find((item) => item.slug === slug)
      : undefined;

    const groupedMap = new Map<DocsCategory | 'uncategorized', HookData[]>();

    for (const item of context.hooks) {
      const category = item.meta?.category ?? 'uncategorized';
      const existing = groupedMap.get(category);

      if (existing) {
        existing.push(item);
      } else {
        groupedMap.set(category, [item]);
      }
    }

    const groupedHooks = CATEGORY_ORDER.map((key) => {
      const hooks = groupedMap.get(key);

      if (!hooks || hooks.length === 0) {
        return null;
      }

      return {
        key,
        label: CATEGORY_LABELS[key],
        hooks: [...hooks].sort(sortHooks),
      };
    }).filter((group): group is GroupedHooks => group !== null);

    return {
      hook,
      hooks: context.hooks,
      groupedHooks,
    };
  }, [context.hooks, slug]);
}

import type { BreadcrumbItem } from '@/app/components';

export type CreateComponentBreadcrumbItemsOptions = {
  componentHref: string;
  componentLabel: string;
  currentLabel?: string;
};

export const createComponentBreadcrumbItems = ({
  componentHref,
  componentLabel,
  currentLabel = 'Docs',
}: CreateComponentBreadcrumbItemsOptions): BreadcrumbItem[] => [
  { href: '/components', label: 'Components' },
  { href: componentHref, label: componentLabel },
  { current: true, label: currentLabel },
];

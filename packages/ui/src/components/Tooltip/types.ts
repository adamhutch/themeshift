import type { ReactElement, ReactNode } from 'react';

import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProviderProps,
  TooltipRootProps as HeadlessTooltipRootProps,
  TooltipTriggerProps,
} from '@themeshift/headless/components/Tooltip';

/** Props for tooltip root behavior and convenience composition. */
export type TooltipRootOwnProps = HeadlessTooltipRootProps & {
  /**
   * Convenience content for `<Tooltip content="...">` usage.
   *
   * When provided, Tooltip automatically renders Trigger and Content internally.
   */
  content?: ReactNode;

  /** Shows arrow in convenience mode when `content` is used. */
  showArrow?: boolean;

  /** Skip-delay window override for this tooltip tree. */
  skipDelayDuration?: number;
};

/** Public props for `Tooltip.Root`. */
export type TooltipRootProps = TooltipRootOwnProps;

/** Public convenience props for `Tooltip`. */
export type TooltipProps = TooltipRootOwnProps & {
  /** Trigger element for convenience usage. */
  children: ReactElement;

  /** Convenience tooltip content. */
  content: ReactNode;
};

export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProviderProps,
  TooltipTriggerProps,
};

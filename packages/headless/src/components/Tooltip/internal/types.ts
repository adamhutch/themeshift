import type { CSSProperties, RefObject } from 'react';

import type { Placement } from '@/hooks/useAnchoredPosition';

export type TooltipProviderContextValue = {
  closeDelay: number;
  delay: number;
  getOpenDelay: (delay: number) => number;
  markClosed: () => void;
  markOpened: () => void;
};

export type TooltipRootContextValue = {
  anchorRef: RefObject<HTMLElement | null>;
  arrowRef: RefObject<HTMLElement | null>;
  arrowStyle: CSSProperties;
  closeImmediate: () => void;
  closeWithDelay: (delayOverride?: number) => void;
  contentClassName?: string;
  contentId: string;
  contentPlacement: Placement;
  contentRef: RefObject<HTMLElement | null>;
  contentStyle: CSSProperties;
  disabled: boolean;
  open: boolean;
  openWithDelay: (delayOverride?: number) => void;
  portal: boolean;
  portalContainer: HTMLElement | null;
};

export const DEFAULT_BOUNDARY_PADDING = 8;
export const DEFAULT_CLOSE_DELAY = 100;
export const DEFAULT_DELAY = 500;
export const DEFAULT_OFFSET = 8;
export const DEFAULT_PLACEMENT: Placement = 'top';
export const DEFAULT_SKIP_DELAY_DURATION = 300;

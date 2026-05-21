/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  TooltipArrow as HeadlessTooltipArrow,
  TooltipContent as HeadlessTooltipContent,
  TooltipProvider as HeadlessTooltipProvider,
  TooltipRoot as HeadlessTooltipRoot,
  TooltipTrigger as HeadlessTooltipTrigger,
} from '@themeshift/headless/components/Tooltip';
import { isValidElement, type ReactElement, type ReactNode } from 'react';

import styles from './Tooltip.module.scss';
import type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from './types';

/** Shares tooltip timing behavior for nearby tooltip interactions. */
export const TooltipProvider = ({
  children,
  closeDelay,
  delay,
  skipDelayDuration,
}: TooltipProviderProps) => (
  <HeadlessTooltipProvider
    closeDelay={closeDelay}
    delay={delay}
    skipDelayDuration={skipDelayDuration}
  >
    {children}
  </HeadlessTooltipProvider>
);

function ensureTriggerElement(children: ReactNode): ReactElement {
  if (!isValidElement(children)) {
    throw new Error(
      'Tooltip convenience usage expects a single React element child trigger.'
    );
  }

  return children;
}

/** Tooltip root state container. */
export const TooltipRoot = ({
  children,
  content,
  showArrow = true,
  skipDelayDuration,
  ...rootProps
}: TooltipRootProps) => {
  const rootNode =
    content === undefined ? (
      <HeadlessTooltipRoot {...rootProps}>{children}</HeadlessTooltipRoot>
    ) : (
      <HeadlessTooltipRoot {...rootProps}>
        <TooltipTrigger asChild>
          {ensureTriggerElement(children)}
        </TooltipTrigger>
        <TooltipContent>
          {content}
          {showArrow ? <TooltipArrow /> : null}
        </TooltipContent>
      </HeadlessTooltipRoot>
    );

  if (skipDelayDuration === undefined) {
    return rootNode;
  }

  return (
    <HeadlessTooltipProvider skipDelayDuration={skipDelayDuration}>
      {rootNode}
    </HeadlessTooltipProvider>
  );
};

/** Tooltip trigger that controls open/close interactions. */
export const TooltipTrigger = (props: TooltipTriggerProps) => (
  <HeadlessTooltipTrigger {...props} />
);

/** Tooltip body container with portal and positioning support. */
export const TooltipContent = ({
  className,
  ...contentProps
}: TooltipContentProps) => (
  <HeadlessTooltipContent
    {...contentProps}
    className={classNames(styles.content, className)}
  />
);

/** Decorative arrow aligned to tooltip placement. */
export const TooltipArrow = ({
  className,
  ...arrowProps
}: TooltipArrowProps) => (
  <HeadlessTooltipArrow
    {...arrowProps}
    className={classNames(styles.arrow, className)}
  />
);

type TooltipComponent = ((props: TooltipRootProps) => ReactElement) & {
  Arrow: typeof TooltipArrow;
  Content: typeof TooltipContent;
  Provider: typeof TooltipProvider;
  Root: typeof TooltipRoot;
  Trigger: typeof TooltipTrigger;
};

/** Composable tooltip primitive with convenience `content` usage support. */
export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
}) as TooltipComponent;

export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProps,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from './types';

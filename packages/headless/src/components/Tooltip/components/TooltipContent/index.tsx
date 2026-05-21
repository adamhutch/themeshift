import { forwardRef, type PointerEvent } from 'react';

import { Portal } from '@/components/Portal';

import { useTooltipRootContext } from '@/components/Tooltip/internal/contexts';
import {
  callEventHandler,
  mergeRefs,
  setRefValue,
} from '@/components/Tooltip/internal/utils';
import type { TooltipContentProps } from '@/components/Tooltip/types';

/** Tooltip body container with portal and positioning support. */
export const TooltipContent = forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      children,
      className,
      id,
      onPointerEnter,
      onPointerLeave,
      portal,
      portalContainer,
      style,
      ...contentProps
    },
    forwardedRef
  ) => {
    const context = useTooltipRootContext('Tooltip.Content');
    const resolvedPortal = portal ?? context.portal;
    const resolvedPortalContainer =
      portalContainer ??
      context.portalContainer ??
      context.anchorRef.current?.ownerDocument?.body ??
      null;

    const setContentRef = mergeRefs<HTMLDivElement>(forwardedRef, (node) => {
      setRefValue(context.contentRef, node);
    });

    const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
      callEventHandler(onPointerEnter, event);

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      context.openWithDelay(0);
    };

    const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
      callEventHandler(onPointerLeave, event);

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (relatedTarget && context.anchorRef.current?.contains(relatedTarget)) {
        return;
      }

      context.closeWithDelay();
    };

    if (!context.open) {
      return null;
    }

    const mergedClassName = [context.contentClassName, className]
      .filter((value) => typeof value === 'string' && value.length > 0)
      .join(' ');

    const contentNode = (
      <div
        {...contentProps}
        className={mergedClassName || undefined}
        data-disabled={context.disabled ? '' : undefined}
        data-placement={context.contentPlacement}
        id={id ?? context.contentId}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={setContentRef}
        role="tooltip"
        style={{ ...context.contentStyle, ...style }}
      >
        {children}
      </div>
    );

    return (
      <Portal container={resolvedPortalContainer} disabled={!resolvedPortal}>
        {contentNode}
      </Portal>
    );
  }
);

TooltipContent.displayName = 'Tooltip.Content';

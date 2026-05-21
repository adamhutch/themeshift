import { Slot } from '@radix-ui/react-slot';
import {
  forwardRef,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';

import { useTooltipRootContext } from '@/components/Tooltip/internal/contexts';
import {
  callEventHandler,
  mergeRefs,
  setRefValue,
} from '@/components/Tooltip/internal/utils';
import type { TooltipTriggerProps } from '@/components/Tooltip/types';

/** Tooltip trigger that controls open/close interactions. */
export const TooltipTrigger = forwardRef<HTMLElement, TooltipTriggerProps>(
  (
    {
      asChild = false,
      children,
      onBlur,
      onFocus,
      onMouseEnter,
      onMouseLeave,
      onPointerEnter,
      onPointerLeave,
      ...triggerProps
    },
    forwardedRef
  ) => {
    const context = useTooltipRootContext('Tooltip.Trigger');

    const setTriggerRef = mergeRefs<HTMLElement>(forwardedRef, (node) => {
      setRefValue(context.anchorRef, node);
    });

    const handlePointerEnter = (event: PointerEvent<HTMLElement>) => {
      callEventHandler(
        onPointerEnter as
          | ((event: PointerEvent<HTMLElement>) => void)
          | undefined,
        event
      );

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      context.openWithDelay();
    };

    const handlePointerLeave = (event: PointerEvent<HTMLElement>) => {
      callEventHandler(
        onPointerLeave as
          | ((event: PointerEvent<HTMLElement>) => void)
          | undefined,
        event
      );

      if (event.defaultPrevented || event.pointerType === 'touch') {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (
        relatedTarget &&
        context.contentRef.current?.contains(relatedTarget)
      ) {
        return;
      }

      context.closeWithDelay();
    };

    const handleMouseEnter = (event: MouseEvent<HTMLElement>) => {
      callEventHandler(
        onMouseEnter as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        event
      );
    };

    const handleMouseLeave = (event: MouseEvent<HTMLElement>) => {
      callEventHandler(
        onMouseLeave as ((event: MouseEvent<HTMLElement>) => void) | undefined,
        event
      );
    };

    const handleFocus = (event: FocusEvent<HTMLElement>) => {
      callEventHandler(
        onFocus as ((event: FocusEvent<HTMLElement>) => void) | undefined,
        event
      );

      if (event.defaultPrevented) {
        return;
      }

      context.openWithDelay();
    };

    const handleBlur = (event: FocusEvent<HTMLElement>) => {
      callEventHandler(
        onBlur as ((event: FocusEvent<HTMLElement>) => void) | undefined,
        event
      );

      if (event.defaultPrevented) {
        return;
      }

      const relatedTarget =
        event.relatedTarget instanceof Node ? event.relatedTarget : null;

      if (
        relatedTarget &&
        context.contentRef.current?.contains(relatedTarget)
      ) {
        return;
      }

      context.closeImmediate();
    };

    const Comp = asChild ? Slot : 'button';

    if (asChild && !children) {
      throw new Error(
        'Tooltip.Trigger with asChild expects a single child element.'
      );
    }

    return (
      <Comp
        {...triggerProps}
        aria-describedby={context.open ? context.contentId : undefined}
        data-disabled={context.disabled ? '' : undefined}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        ref={setTriggerRef}
        type={asChild ? undefined : 'button'}
      >
        {children}
      </Comp>
    );
  }
);

TooltipTrigger.displayName = 'Tooltip.Trigger';

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useAnchoredPosition } from '@/hooks/useAnchoredPosition';

import {
  TooltipRootContext,
  useTooltipProviderContext,
} from '@/components/Tooltip/internal/contexts';
import {
  DEFAULT_BOUNDARY_PADDING,
  DEFAULT_CLOSE_DELAY,
  DEFAULT_DELAY,
  DEFAULT_OFFSET,
  DEFAULT_PLACEMENT,
} from '@/components/Tooltip/internal/types';
import type { TooltipRootProps } from '@/components/Tooltip/types';

/** Tooltip root state container. */
export const TooltipRoot = ({
  boundaryPadding = DEFAULT_BOUNDARY_PADDING,
  children,
  className,
  closeDelay,
  defaultOpen = false,
  delay,
  disabled = false,
  id,
  offset = DEFAULT_OFFSET,
  onOpenChange,
  open,
  placement = DEFAULT_PLACEMENT,
  portal = true,
  portalContainer = null,
}: TooltipRootProps) => {
  const provider = useTooltipProviderContext();
  const generatedId = useId();
  const tooltipId = id ?? `tooltip-${generatedId.replaceAll(':', '')}`;
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const resolvedOpen = disabled
    ? false
    : isControlled
      ? open
      : uncontrolledOpen;
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const arrowRef = useRef<HTMLElement | null>(null);

  const resolvedDelay = delay ?? provider?.delay ?? DEFAULT_DELAY;
  const resolvedCloseDelay =
    closeDelay ?? provider?.closeDelay ?? DEFAULT_CLOSE_DELAY;
  const previousResolvedOpenRef = useRef(resolvedOpen);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (disabled && nextOpen) {
        return;
      }

      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  const clearOpenTimer = useCallback(() => {
    if (typeof window === 'undefined' || openTimerRef.current === null) {
      return;
    }

    window.clearTimeout(openTimerRef.current);
    openTimerRef.current = null;
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (typeof window === 'undefined' || closeTimerRef.current === null) {
      return;
    }

    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);

  const closeImmediate = useCallback(() => {
    clearOpenTimer();
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer, clearOpenTimer, setOpen]);

  const closeWithDelay = useCallback(
    (delayOverride?: number) => {
      clearOpenTimer();
      clearCloseTimer();

      const timeout = delayOverride ?? resolvedCloseDelay;

      if (timeout <= 0 || typeof window === 'undefined') {
        setOpen(false);
        return;
      }

      closeTimerRef.current = window.setTimeout(() => {
        closeTimerRef.current = null;
        setOpen(false);
      }, timeout);
    },
    [clearCloseTimer, clearOpenTimer, resolvedCloseDelay, setOpen]
  );

  const openWithDelay = useCallback(
    (delayOverride?: number) => {
      if (disabled) {
        return;
      }

      clearOpenTimer();
      clearCloseTimer();

      const delayValue =
        delayOverride ?? provider?.getOpenDelay(resolvedDelay) ?? resolvedDelay;

      if (delayValue <= 0 || typeof window === 'undefined') {
        setOpen(true);
        return;
      }

      openTimerRef.current = window.setTimeout(() => {
        openTimerRef.current = null;
        setOpen(true);
      }, delayValue);
    },
    [
      clearCloseTimer,
      clearOpenTimer,
      disabled,
      provider,
      resolvedDelay,
      setOpen,
    ]
  );

  const {
    actualPlacement,
    anchorRef,
    arrowStyle,
    floatingRef,
    style: contentStyle,
  } = useAnchoredPosition({
    arrowRef,
    boundaryPadding,
    flip: true,
    offset,
    open: resolvedOpen,
    placement,
    shift: true,
    strategy: 'fixed',
  });

  useEffect(() => {
    if (!resolvedOpen || typeof document === 'undefined') {
      return;
    }

    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeImmediate();
      }
    };

    document.addEventListener('keydown', listener);

    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, [closeImmediate, resolvedOpen]);

  useEffect(() => {
    if (!provider || previousResolvedOpenRef.current === resolvedOpen) {
      return;
    }

    if (resolvedOpen) {
      provider.markOpened();
    } else {
      provider.markClosed();
    }

    previousResolvedOpenRef.current = resolvedOpen;
  }, [provider, resolvedOpen]);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, [clearCloseTimer, clearOpenTimer]);

  const value = useMemo(
    () => ({
      anchorRef,
      arrowRef,
      arrowStyle,
      closeImmediate,
      closeWithDelay,
      contentClassName: className,
      contentId: tooltipId,
      contentPlacement: actualPlacement,
      contentRef: floatingRef,
      contentStyle,
      disabled,
      open: resolvedOpen,
      openWithDelay,
      portal,
      portalContainer,
    }),
    [
      actualPlacement,
      anchorRef,
      arrowStyle,
      className,
      closeImmediate,
      closeWithDelay,
      contentStyle,
      disabled,
      floatingRef,
      openWithDelay,
      portal,
      portalContainer,
      resolvedOpen,
      tooltipId,
    ]
  );

  return (
    <TooltipRootContext.Provider value={value}>
      {children}
    </TooltipRootContext.Provider>
  );
};

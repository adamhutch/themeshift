import { useCallback, useEffect, useMemo, useRef } from 'react';

import { TooltipProviderContext } from '@/components/Tooltip/internal/contexts';
import {
  DEFAULT_CLOSE_DELAY,
  DEFAULT_DELAY,
  DEFAULT_SKIP_DELAY_DURATION,
} from '@/components/Tooltip/internal/types';
import type { TooltipProviderProps } from '@/components/Tooltip/types';

/** Shares tooltip timing behavior for nearby tooltip interactions. */
export const TooltipProvider = ({
  children,
  closeDelay = DEFAULT_CLOSE_DELAY,
  delay = DEFAULT_DELAY,
  skipDelayDuration = DEFAULT_SKIP_DELAY_DURATION,
}: TooltipProviderProps) => {
  const isOpenDelayedRef = useRef(true);
  const openTooltipCountRef = useRef(0);
  const skipDelayTimerRef = useRef<number | null>(null);

  const clearSkipDelayTimer = useCallback(() => {
    if (typeof window === 'undefined' || skipDelayTimerRef.current === null) {
      return;
    }

    window.clearTimeout(skipDelayTimerRef.current);
    skipDelayTimerRef.current = null;
  }, []);

  const markOpened = useCallback(() => {
    clearSkipDelayTimer();
    openTooltipCountRef.current += 1;
    isOpenDelayedRef.current = false;
  }, [clearSkipDelayTimer]);

  const markClosed = useCallback(() => {
    clearSkipDelayTimer();
    openTooltipCountRef.current = Math.max(0, openTooltipCountRef.current - 1);

    if (openTooltipCountRef.current > 0) {
      isOpenDelayedRef.current = false;
      return;
    }

    if (typeof window === 'undefined') {
      isOpenDelayedRef.current = true;
      return;
    }

    skipDelayTimerRef.current = window.setTimeout(() => {
      skipDelayTimerRef.current = null;
      isOpenDelayedRef.current = true;
    }, skipDelayDuration);
  }, [clearSkipDelayTimer, skipDelayDuration]);

  const getOpenDelay = useCallback((localDelay: number) => {
    return isOpenDelayedRef.current ? localDelay : 0;
  }, []);

  useEffect(
    () => () => {
      clearSkipDelayTimer();
    },
    [clearSkipDelayTimer]
  );

  const value = useMemo(
    () => ({
      closeDelay,
      delay,
      getOpenDelay,
      markClosed,
      markOpened,
    }),
    [closeDelay, delay, getOpenDelay, markClosed, markOpened]
  );

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  );
};

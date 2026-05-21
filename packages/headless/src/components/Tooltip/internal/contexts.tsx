import { createContext, useContext } from 'react';

import type {
  TooltipProviderContextValue,
  TooltipRootContextValue,
} from './types';

export const TooltipProviderContext =
  createContext<TooltipProviderContextValue | null>(null);
export const TooltipRootContext = createContext<TooltipRootContextValue | null>(
  null
);

export function useTooltipRootContext(component: string) {
  const context = useContext(TooltipRootContext);

  if (!context) {
    throw new Error(`${component} must be used within Tooltip.`);
  }

  return context;
}

export function useTooltipProviderContext() {
  return useContext(TooltipProviderContext);
}

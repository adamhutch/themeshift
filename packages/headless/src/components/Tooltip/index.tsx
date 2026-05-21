/* eslint-disable react-refresh/only-export-components */
import {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
} from './components';

export const Tooltip = Object.assign(TooltipRoot, {
  Arrow: TooltipArrow,
  Content: TooltipContent,
  Provider: TooltipProvider,
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
});

export {
  TooltipArrow,
  TooltipContent,
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
};

export type {
  TooltipArrowProps,
  TooltipContentProps,
  TooltipPlacement,
  TooltipProviderProps,
  TooltipRootProps,
  TooltipTriggerProps,
} from './types';

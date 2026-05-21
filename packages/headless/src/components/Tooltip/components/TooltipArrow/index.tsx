import { forwardRef } from 'react';

import { useTooltipRootContext } from '@/components/Tooltip/internal/contexts';
import { mergeRefs, setRefValue } from '@/components/Tooltip/internal/utils';
import type { TooltipArrowProps } from '@/components/Tooltip/types';

/** Decorative arrow aligned to tooltip placement. */
export const TooltipArrow = forwardRef<HTMLSpanElement, TooltipArrowProps>(
  ({ style, ...arrowProps }, forwardedRef) => {
    const context = useTooltipRootContext('Tooltip.Arrow');

    const setArrowRef = mergeRefs<HTMLSpanElement>(forwardedRef, (node) => {
      setRefValue(context.arrowRef, node);
    });

    if (!context.open) {
      return null;
    }

    return (
      <span
        {...arrowProps}
        aria-hidden="true"
        data-placement={context.contentPlacement}
        ref={setArrowRef}
        style={{ ...context.arrowStyle, ...style }}
      />
    );
  }
);

TooltipArrow.displayName = 'Tooltip.Arrow';

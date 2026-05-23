import { forwardRef } from 'react';

import type { ChipGroupProps } from '@/components/Chip/types';

/**
 * Headless layout-only wrapper for grouped chips.
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  (
    {
      children,
      gap = 'small',
      orientation = 'horizontal',
      role,
      wrap = true,
      ...groupProps
    },
    ref
  ) => {
    const resolvedRole =
      role ??
      (groupProps['aria-label'] || groupProps['aria-labelledby']
        ? 'group'
        : undefined);

    return (
      <div
        {...groupProps}
        data-gap={gap}
        data-orientation={orientation}
        data-wrap={wrap ? '' : undefined}
        ref={ref}
        role={resolvedRole}
      >
        {children}
      </div>
    );
  }
);

ChipGroup.displayName = 'Chip.Group';

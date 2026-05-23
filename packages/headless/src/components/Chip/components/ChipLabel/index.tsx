import { forwardRef } from 'react';

import type { ChipLabelProps } from '@/components/Chip/types';

/**
 * Headless text label slot for Chip content.
 */
export const ChipLabel = forwardRef<HTMLSpanElement, ChipLabelProps>(
  ({ children, truncate = false, ...labelProps }, ref) => (
    <span {...labelProps} data-truncate={truncate ? '' : undefined} ref={ref}>
      {children}
    </span>
  )
);

ChipLabel.displayName = 'Chip.Label';

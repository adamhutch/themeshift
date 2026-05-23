import { forwardRef } from 'react';

import type { ChipIconProps } from '@/components/Chip/types';

/**
 * Headless icon slot for Chip composition.
 */
export const ChipIcon = forwardRef<HTMLSpanElement, ChipIconProps>(
  ({ decorative = true, position = 'start', ...iconProps }, ref) => (
    <span
      {...iconProps}
      aria-hidden={decorative ? true : iconProps['aria-hidden']}
      data-position={position}
      ref={ref}
    />
  )
);

ChipIcon.displayName = 'Chip.Icon';

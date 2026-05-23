import { forwardRef, type MouseEventHandler } from 'react';

import { useChipContextOptional } from '@/components/Chip/internal/contexts';
import type { ChipRemoveButtonProps } from '@/components/Chip/types';

/**
 * Headless remove-action button slot for Chip composition.
 */
export const ChipRemoveButton = forwardRef<
  HTMLButtonElement,
  ChipRemoveButtonProps
>(({ disabled, onClick, ...removeButtonProps }, ref) => {
  const context = useChipContextOptional();
  const resolvedDisabled = disabled ?? context?.disabled ?? false;

  const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.stopPropagation();

    if (resolvedDisabled) {
      return;
    }

    onClick?.(event);
  };

  return (
    <button
      {...removeButtonProps}
      data-disabled={resolvedDisabled ? '' : undefined}
      disabled={resolvedDisabled}
      onClick={handleClick}
      ref={ref}
      type="button"
    />
  );
});

ChipRemoveButton.displayName = 'Chip.RemoveButton';

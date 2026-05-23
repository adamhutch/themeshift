import { forwardRef, type ForwardedRef } from 'react';

import { useFilterChipGroupContextOptional } from '@/components/FilterChip/internal/contexts';
import type { FilterChipHiddenInputProps } from '@/components/FilterChip/types';

function assignInputRef(
  ref: ForwardedRef<HTMLInputElement> | undefined,
  node: HTMLInputElement | null
) {
  if (!ref) {
    return;
  }

  if (typeof ref === 'function') {
    ref(node);
    return;
  }

  ref.current = node;
}

/**
 * Headless hidden-input serializer for `FilterChip.Group` form submissions.
 */
export const FilterChipHiddenInput = forwardRef<
  HTMLInputElement,
  FilterChipHiddenInputProps
>(({ disabled, name, ...inputProps }, ref) => {
  const context = useFilterChipGroupContextOptional();

  if (!context) {
    return null;
  }

  const isInputDisabled = disabled ?? context.disabled;

  if (context.type === 'single') {
    const value = context.selectedValues[0];

    if (!value) {
      return null;
    }

    return (
      <input
        {...inputProps}
        disabled={isInputDisabled}
        name={name}
        ref={ref}
        type="hidden"
        value={value}
      />
    );
  }

  if (context.selectedValues.length === 0) {
    return null;
  }

  return (
    <>
      {context.selectedValues.map((value, index) => (
        <input
          {...inputProps}
          disabled={isInputDisabled}
          key={`${name}-${value}-${index}`}
          name={name}
          ref={
            index === 0
              ? (node) => {
                  assignInputRef(ref, node);
                }
              : undefined
          }
          type="hidden"
          value={value}
        />
      ))}
    </>
  );
});

FilterChipHiddenInput.displayName = 'FilterChip.HiddenInput';

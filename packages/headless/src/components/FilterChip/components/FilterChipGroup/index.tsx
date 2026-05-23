import { forwardRef, useMemo, useState } from 'react';

import { FilterChipGroupContext } from '@/components/FilterChip/internal/contexts';
import type {
  FilterChipGroupProps,
  FilterChipGroupValue,
} from '@/components/FilterChip/types';

function toSelectedValues(
  nextValue: FilterChipGroupValue | undefined,
  type: 'single' | 'multiple'
) {
  if (type === 'single') {
    if (typeof nextValue === 'string' && nextValue) {
      return [nextValue];
    }

    if (Array.isArray(nextValue) && nextValue[0]) {
      return [nextValue[0]];
    }

    return [];
  }

  if (Array.isArray(nextValue)) {
    return [...new Set(nextValue.filter(Boolean))];
  }

  if (typeof nextValue === 'string' && nextValue) {
    return [nextValue];
  }

  return [];
}

/**
 * Headless selection-state wrapper for grouped filter chips.
 */
export const FilterChipGroup = forwardRef<HTMLDivElement, FilterChipGroupProps>(
  (
    {
      children,
      defaultValue,
      disabled = false,
      gap = 'small',
      onValueChange,
      orientation = 'horizontal',
      role,
      type = 'multiple',
      value,
      wrap = true,
      ...groupProps
    },
    ref
  ) => {
    const [uncontrolledValue, setUncontrolledValue] =
      useState<FilterChipGroupValue>(
        defaultValue ?? (type === 'multiple' ? [] : '')
      );
    const isControlled = value !== undefined;
    const resolvedValue = isControlled ? value : uncontrolledValue;
    const selectedValues = useMemo(
      () => toSelectedValues(resolvedValue, type),
      [resolvedValue, type]
    );
    const resolvedRole =
      role ??
      (groupProps['aria-label'] || groupProps['aria-labelledby']
        ? 'group'
        : undefined);

    const contextValue = useMemo(
      () => ({
        disabled,
        selectedValues,
        toggleValue: (nextValue: string) => {
          if (!nextValue || disabled) {
            return;
          }

          if (type === 'single') {
            const isAlreadySelected = selectedValues.includes(nextValue);
            const nextSingleValue = isAlreadySelected ? '' : nextValue;

            if (!isControlled) {
              setUncontrolledValue(nextSingleValue);
            }

            onValueChange?.(nextSingleValue);
            return;
          }

          const isAlreadySelected = selectedValues.includes(nextValue);
          const nextMultipleValue = isAlreadySelected
            ? selectedValues.filter((valueItem) => valueItem !== nextValue)
            : [...selectedValues, nextValue];

          if (!isControlled) {
            setUncontrolledValue(nextMultipleValue);
          }

          onValueChange?.(nextMultipleValue);
        },
        type,
      }),
      [disabled, isControlled, onValueChange, selectedValues, type]
    );

    return (
      <FilterChipGroupContext.Provider value={contextValue}>
        <div
          {...groupProps}
          data-disabled={disabled ? '' : undefined}
          data-gap={gap}
          data-orientation={orientation}
          data-type={type}
          data-wrap={wrap ? '' : undefined}
          ref={ref}
          role={resolvedRole}
        >
          {children}
        </div>
      </FilterChipGroupContext.Provider>
    );
  }
);

FilterChipGroup.displayName = 'FilterChip.Group';

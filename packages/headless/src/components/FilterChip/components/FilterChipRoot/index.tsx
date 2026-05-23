import { Slot } from '@radix-ui/react-slot';
import {
  Children,
  forwardRef,
  isValidElement,
  useRef,
  useState,
  type Ref,
  type KeyboardEventHandler,
  type MouseEventHandler,
  type ReactElement,
  type ReactNode,
} from 'react';

import { useFilterChipGroupContextOptional } from '@/components/FilterChip/internal/contexts';
import type { FilterChipRootProps } from '@/components/FilterChip/types';

type SlottableChild = ReactElement<{ children?: ReactNode }>;

/**
 * Headless selectable root primitive for filter chip behavior.
 */
export const FilterChipRoot = forwardRef<HTMLElement, FilterChipRootProps>(
  (
    {
      asChild = false,
      children,
      color = 'neutral',
      defaultSelected = false,
      disabled,
      onClick,
      onKeyDown,
      onSelectedChange,
      selected,
      size = 'medium',
      value,
      variant = 'subtle',
      ...rootProps
    },
    ref
  ) => {
    const group = useFilterChipGroupContextOptional();
    const [uncontrolledSelected, setUncontrolledSelected] =
      useState(defaultSelected);
    const hasWarnedMissingValueRef = useRef(false);
    const isControlled = selected !== undefined;
    const isGrouped = !!group && value !== undefined;
    const resolvedDisabled = disabled ?? group?.disabled ?? false;

    if (
      import.meta.env.MODE !== 'production' &&
      group &&
      value === undefined &&
      !resolvedDisabled &&
      !hasWarnedMissingValueRef.current
    ) {
      hasWarnedMissingValueRef.current = true;
      console.warn(
        'ThemeShift FilterChip inside FilterChip.Group requires a `value` prop to participate in group selection.'
      );
    }

    const resolvedSelected = isGrouped
      ? group.selectedValues.includes(value)
      : isControlled
        ? selected
        : uncontrolledSelected;

    const toggleSelected = () => {
      if (resolvedDisabled) {
        return;
      }

      if (isGrouped) {
        group.toggleValue(value);
        return;
      }

      const nextSelected = !resolvedSelected;

      if (!isControlled) {
        setUncontrolledSelected(nextSelected);
      }

      onSelectedChange?.(nextSelected);
    };

    const handleClick: MouseEventHandler<HTMLButtonElement> = (event) => {
      onClick?.(event);

      if (event.defaultPrevented) {
        return;
      }

      toggleSelected();
    };

    const handleKeyDown: KeyboardEventHandler<HTMLButtonElement> = (event) => {
      onKeyDown?.(event);

      if (event.defaultPrevented) {
        return;
      }

      if (!asChild) {
        return;
      }

      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSelected();
      }
    };

    const commonProps = {
      ...rootProps,
      'aria-disabled':
        resolvedDisabled && asChild ? true : rootProps['aria-disabled'],
      'aria-pressed': resolvedSelected,
      'data-color': color,
      'data-disabled': resolvedDisabled ? '' : undefined,
      'data-selected': resolvedSelected ? 'true' : undefined,
      'data-size': size,
      'data-variant': variant,
      onClick: handleClick,
      onKeyDown: handleKeyDown,
      ref,
      role: asChild ? (rootProps.role ?? 'button') : rootProps.role,
      tabIndex:
        asChild && rootProps.tabIndex === undefined ? 0 : rootProps.tabIndex,
    };

    if (asChild) {
      const childElement =
        isValidElement(children) && Children.count(children) === 1
          ? (Children.only(children) as SlottableChild)
          : null;

      if (!childElement) {
        throw new Error(
          'ThemeShift FilterChip with asChild expects a single React element child.'
        );
      }

      return <Slot {...commonProps}>{children}</Slot>;
    }

    return (
      <button
        {...commonProps}
        disabled={resolvedDisabled}
        ref={ref as Ref<HTMLButtonElement>}
        type="button"
      >
        {children}
      </button>
    );
  }
);

FilterChipRoot.displayName = 'FilterChip';

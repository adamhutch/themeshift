import { Slot } from '@radix-ui/react-slot';
import {
  Children,
  forwardRef,
  isValidElement,
  useMemo,
  type ComponentPropsWithoutRef,
  type ReactElement,
  type ReactNode,
} from 'react';

import { ChipContext } from '@/components/Chip/internal/contexts';
import type { ChipRootProps } from '@/components/Chip/types';

type SlottableChild = ReactElement<{ children?: ReactNode }>;

/**
 * Headless root primitive for Chip composition.
 */
export const ChipRoot = forwardRef<HTMLElement, ChipRootProps>(
  (
    {
      asChild = false,
      children,
      className,
      color = 'neutral',
      disabled = false,
      interactive = false,
      radius = 'full',
      size = 'medium',
      variant = 'subtle',
      ...rootProps
    },
    ref
  ) => {
    const childElement =
      asChild && isValidElement(children)
        ? (Children.only(children) as SlottableChild)
        : null;

    if (asChild && !childElement) {
      throw new Error(
        'ThemeShift Chip with asChild expects a single React element child.'
      );
    }

    const contextValue = useMemo(
      () => ({ disabled, interactive }),
      [disabled, interactive]
    );

    const commonProps = {
      ...rootProps,
      'aria-disabled':
        disabled && (asChild || !interactive)
          ? true
          : rootProps['aria-disabled'],
      className,
      'data-color': color,
      'data-disabled': disabled ? '' : undefined,
      'data-interactive': interactive ? '' : undefined,
      'data-radius': radius,
      'data-size': size,
      'data-variant': variant,
      ref,
    };

    if (asChild) {
      return (
        <ChipContext.Provider value={contextValue}>
          <Slot {...commonProps}>{children}</Slot>
        </ChipContext.Provider>
      );
    }

    if (interactive) {
      return (
        <ChipContext.Provider value={contextValue}>
          <button
            {...(commonProps as unknown as ComponentPropsWithoutRef<'button'>)}
            disabled={disabled}
            type="button"
          >
            {children}
          </button>
        </ChipContext.Provider>
      );
    }

    return (
      <ChipContext.Provider value={contextValue}>
        <span {...commonProps}>{children}</span>
      </ChipContext.Provider>
    );
  }
);

ChipRoot.displayName = 'Chip';

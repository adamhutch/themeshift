import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

import type {
  ChipColor,
  ChipGroupGap,
  ChipGroupOrientation,
  ChipSize,
  ChipVariant,
} from '@/components/Chip';

/**
 * Selection behavior used by `FilterChip.Group`.
 */
export type FilterChipGroupType = 'single' | 'multiple';

/**
 * Controlled or uncontrolled value shape used by `FilterChip.Group`.
 */
export type FilterChipGroupValue = string | string[];

/**
 * Props for the headless `FilterChip` root primitive.
 */
export type FilterChipRootProps = {
  /**
   * Chip content.
   */
  children?: ReactNode;

  /**
   * Additional class names for the root element.
   */
  className?: string;

  /**
   * Controlled selected state.
   */
  selected?: boolean;

  /**
   * Initial selected state for uncontrolled usage.
   */
  defaultSelected?: boolean;

  /**
   * Called with the next selected state after interaction.
   */
  onSelectedChange?: (selected: boolean) => void;

  /**
   * Optional selection value used by `FilterChip.Group`.
   */
  value?: string;

  /**
   * Disables interaction.
   */
  disabled?: boolean;

  /**
   * Semantic color metadata for convenience wrappers.
   */
  color?: ChipColor;

  /**
   * Size metadata for convenience wrappers.
   */
  size?: ChipSize;

  /**
   * Variant metadata for convenience wrappers.
   */
  variant?: ChipVariant;

  /**
   * Applies root behavior and attributes to a single child element.
   */
  asChild?: boolean;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'defaultValue' | 'type' | 'value'
>;

/**
 * Public alias for docs tooling so `FilterChip` root props surface clearly.
 */
export type FilterChipProps = FilterChipRootProps;

/**
 * Props for the headless `FilterChip.Group` primitive.
 */
export type FilterChipGroupProps = {
  /**
   * Filter chips and related inline content.
   */
  children: ReactNode;

  /**
   * Selection behavior for descendants.
   */
  type?: FilterChipGroupType;

  /**
   * Controlled group value.
   */
  value?: FilterChipGroupValue;

  /**
   * Initial group value for uncontrolled usage.
   */
  defaultValue?: FilterChipGroupValue;

  /**
   * Called with the next group value.
   */
  onValueChange?: (value: FilterChipGroupValue) => void;

  /**
   * Disables all group descendants.
   */
  disabled?: boolean;

  /**
   * Layout direction metadata for convenience wrappers.
   */
  orientation?: ChipGroupOrientation;

  /**
   * Wrap behavior metadata for convenience wrappers.
   */
  wrap?: boolean;

  /**
   * Gap metadata for convenience wrappers.
   */
  gap?: ChipGroupGap;

  /**
   * Optional accessible label for grouped chips.
   */
  'aria-label'?: string;

  /**
   * Optional accessible label relationship for grouped chips.
   */
  'aria-labelledby'?: string;

  /**
   * Additional class names for the group wrapper.
   */
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'defaultValue' | 'onChange' | 'value'
>;

/**
 * Props for `FilterChip.HiddenInput`.
 */
export type FilterChipHiddenInputProps = {
  /**
   * Form field name used for hidden input serialization.
   */
  name: string;

  /**
   * Disabled state override for hidden inputs.
   */
  disabled?: boolean;
} & Omit<
  ComponentPropsWithoutRef<'input'>,
  'defaultValue' | 'disabled' | 'name' | 'type' | 'value'
>;

/**
 * Compound component contract for `FilterChip`.
 */
export type FilterChipCompoundComponent = ForwardRefExoticComponent<
  FilterChipRootProps & RefAttributes<HTMLElement>
> & {
  Group: ForwardRefExoticComponent<
    FilterChipGroupProps & RefAttributes<HTMLDivElement>
  >;
  HiddenInput: ForwardRefExoticComponent<
    FilterChipHiddenInputProps & RefAttributes<HTMLInputElement>
  >;
};

import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

/**
 * Visual size scale used by FilterChip primitives.
 */
export type FilterChipSize = 'small' | 'medium' | 'large';

/**
 * Visual style treatment used by FilterChip primitives.
 */
export type FilterChipVariant = 'subtle' | 'outline' | 'solid';

/**
 * Semantic color intent used by FilterChip primitives.
 */
export type FilterChipColor =
  | 'neutral'
  | 'accent'
  | 'success'
  | 'warning'
  | 'danger';

/**
 * Spacing scale used by `FilterChip.Group`.
 */
export type FilterChipGroupGap = 'xSmall' | 'small' | 'medium';

/**
 * Layout direction used by `FilterChip.Group`.
 */
export type FilterChipGroupOrientation = 'horizontal' | 'vertical';

/**
 * Selection behavior used by `FilterChip.Group`.
 */
export type FilterChipGroupType = 'single' | 'multiple';

/**
 * Controlled or uncontrolled value shape used by `FilterChip.Group`.
 */
export type FilterChipGroupValue = string | string[];

/**
 * Props for the ThemeShift `FilterChip` root component.
 */
export type FilterChipRootProps = {
  /**
   * Chip content.
   */
  children?: ReactNode;

  /**
   * Optional selection value used by `FilterChip.Group`.
   */
  value?: string;

  /**
   * Controlled selected state.
   */
  selected?: boolean;

  /**
   * Initial selected state for uncontrolled usage.
   */
  defaultSelected?: boolean;

  /**
   * Called with the next selected state.
   */
  onSelectedChange?: (selected: boolean) => void;

  /**
   * Disables interaction.
   */
  disabled?: boolean;

  /**
   * Visual size preset.
   */
  size?: FilterChipSize;

  /**
   * Visual variant preset.
   */
  variant?: FilterChipVariant;

  /**
   * Semantic color preset.
   */
  color?: FilterChipColor;

  /**
   * Optional icon content rendered before the label.
   */
  startIcon?: ReactNode;

  /**
   * Optional icon content rendered after the label.
   */
  endIcon?: ReactNode;

  /**
   * Optional avatar content rendered before the label.
   */
  avatar?: ReactNode;

  /**
   * Optional selected-state icon content.
   *
   * Set to `true` to use the default check icon.
   */
  selectedIcon?: ReactNode | boolean;

  /**
   * Reserves selected-icon layout space while unselected.
   *
   * Use this to prevent label/content shifting when the selected icon appears.
   */
  reserveSelectedIconSpace?: boolean;

  /**
   * Hides selected-state icon rendering.
   */
  hideSelectedIcon?: boolean;

  /**
   * Applies behavior and attributes to a single child element.
   */
  asChild?: boolean;

  /**
   * Additional class names for the root element.
   */
  className?: string;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'defaultValue' | 'type' | 'value'
>;

/**
 * Public alias for docs tooling so `FilterChip` root props surface clearly.
 */
export type FilterChipProps = FilterChipRootProps;

/**
 * Props for `FilterChip.Group`.
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
   * Layout direction for grouped chips.
   */
  orientation?: FilterChipGroupOrientation;

  /**
   * Wrap behavior for grouped chips.
   */
  wrap?: boolean;

  /**
   * Gap preset for grouped chips.
   */
  gap?: FilterChipGroupGap;

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

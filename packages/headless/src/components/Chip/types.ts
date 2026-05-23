import type {
  ComponentPropsWithoutRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
} from 'react';

/**
 * Visual size scale used by Chip primitives.
 */
export type ChipSize = 'small' | 'medium' | 'large';

/**
 * Visual style treatment used by Chip primitives.
 */
export type ChipVariant = 'subtle' | 'outline' | 'solid';

/**
 * Semantic color intent used by Chip primitives.
 */
export type ChipColor = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * Border radius presets used by Chip primitives.
 */
export type ChipRadius = 'none' | 'full' | 'large' | 'medium';

/**
 * Spacing scale used by `Chip.Group`.
 */
export type ChipGroupGap = 'xSmall' | 'small' | 'medium';

/**
 * Layout direction used by `Chip.Group`.
 */
export type ChipGroupOrientation = 'horizontal' | 'vertical';

/**
 * Props for the headless `Chip` root primitive.
 */
export type ChipRootProps = {
  /**
   * Chip contents and slot primitives.
   */
  children?: ReactNode;

  /**
   * Additional class names for the root element.
   */
  className?: string;

  /**
   * Semantic color metadata for convenience wrappers.
   */
  color?: ChipColor;

  /**
   * Disables pointer and keyboard interactions for the chip.
   */
  disabled?: boolean;

  /**
   * Enables interactive root semantics.
   *
   * When true and `asChild` is false, the root renders a native button.
   */
  interactive?: boolean;

  /**
   * Applies root behavior and attributes to a single child element.
   */
  asChild?: boolean;

  /**
   * Radius metadata for convenience wrappers.
   */
  radius?: ChipRadius;

  /**
   * Size metadata for convenience wrappers.
   */
  size?: ChipSize;

  /**
   * Variant metadata for convenience wrappers.
   */
  variant?: ChipVariant;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'color'>;

/**
 * Props for `Chip.Label`.
 */
export type ChipLabelProps = {
  /**
   * Label content.
   */
  children: ReactNode;

  /**
   * Additional class names for the label.
   */
  className?: string;

  /**
   * Enables single-line truncation metadata for convenience wrappers.
   */
  truncate?: boolean;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/**
 * Props for `Chip.Icon`.
 */
export type ChipIconProps = {
  /**
   * Icon content.
   */
  children: ReactNode;

  /**
   * Additional class names for the icon slot.
   */
  className?: string;

  /**
   * Marks the icon as decorative by default.
   */
  decorative?: boolean;

  /**
   * Position metadata for convenience wrappers.
   */
  position?: 'start' | 'end';
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/**
 * Props for `Chip.Avatar`.
 */
export type ChipAvatarProps = {
  /**
   * Optional custom avatar content.
   */
  children?: ReactNode;

  /**
   * Additional class names for the avatar slot.
   */
  className?: string;

  /**
   * Optional fallback content when no image source is provided.
   */
  fallback?: ReactNode;

  /**
   * Name used to derive initials when no children/fallback are provided.
   */
  name?: string;

  /**
   * Optional image source URL.
   */
  src?: string;

  /**
   * Optional image alternate text.
   */
  alt?: string;
} & Omit<ComponentPropsWithoutRef<'span'>, 'children'>;

/**
 * Props for `Chip.RemoveButton`.
 */
export type ChipRemoveButtonProps = {
  /**
   * Accessible name for the remove action.
   */
  'aria-label': string;

  /**
   * Optional custom button content.
   */
  children?: ReactNode;

  /**
   * Additional class names for the remove button.
   */
  className?: string;

  /**
   * Explicit disabled override.
   */
  disabled?: boolean;

  /**
   * Called after the default stop-propagation behavior.
   */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & Omit<
  ComponentPropsWithoutRef<'button'>,
  'aria-label' | 'children' | 'disabled' | 'onClick' | 'type'
>;

/**
 * Props for `Chip.Group`.
 */
export type ChipGroupProps = {
  /**
   * Optional accessible label for grouped chips.
   */
  'aria-label'?: string;

  /**
   * Optional accessible label relationship for grouped chips.
   */
  'aria-labelledby'?: string;

  /**
   * Chip items and related inline content.
   */
  children: ReactNode;

  /**
   * Additional class names for the group wrapper.
   */
  className?: string;

  /**
   * Gap metadata for convenience wrappers.
   */
  gap?: ChipGroupGap;

  /**
   * Orientation metadata for convenience wrappers.
   */
  orientation?: ChipGroupOrientation;

  /**
   * Wrap behavior metadata for convenience wrappers.
   */
  wrap?: boolean;
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>;

/**
 * Compound component contract for `Chip`.
 */
export type ChipCompoundComponent = ForwardRefExoticComponent<
  ChipRootProps & RefAttributes<HTMLElement>
> & {
  Avatar: ForwardRefExoticComponent<
    ChipAvatarProps & RefAttributes<HTMLSpanElement>
  >;
  Group: ForwardRefExoticComponent<
    ChipGroupProps & RefAttributes<HTMLDivElement>
  >;
  Icon: ForwardRefExoticComponent<
    ChipIconProps & RefAttributes<HTMLSpanElement>
  >;
  Label: ForwardRefExoticComponent<
    ChipLabelProps & RefAttributes<HTMLSpanElement>
  >;
  RemoveButton: ForwardRefExoticComponent<
    ChipRemoveButtonProps & RefAttributes<HTMLButtonElement>
  >;
};

/**
 * Alias for docs tooling so `Chip` root props surface clearly.
 */
export type ChipProps = ChipRootProps;

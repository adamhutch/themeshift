import type { ReactElement, ReactNode } from 'react';

/** Available button size variants. */
export type ButtonSize = 'small' | 'medium' | 'large';

/** Available button intent variants. */
export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'constructive'
  | 'destructive';

type ButtonBaseProps = {
  /**
   * Renders the Button styles onto a single child element instead of a native
   * button.
   */
  asChild?: boolean;

  /** Additional class names to append to the button element. */
  className?: string;

  /** Visual treatment used to communicate the action's priority or outcome. */
  intent?: ButtonIntent;

  /**
   * Renders a Spinner component to indicate to the user this button is working.
   *
   * Also applies an `aria-busy` attribute to the component for accessibility.
   */
  isBusy?: boolean;

  /** Predefined size variant for spacing and typography. */
  size?: ButtonSize;

  /**
   * Applies disabled styling without disabling interaction.
   *
   * Example: `<Button visuallyDisabled onClick={showReason}>Upgrade required</Button>`
   */
  visuallyDisabled?: boolean;
};

type NativeButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  keyof ButtonBaseProps | 'children'
>;

type ButtonOnlyPropNames =
  | 'disabled'
  | 'form'
  | 'formAction'
  | 'formEncType'
  | 'formMethod'
  | 'formNoValidate'
  | 'formTarget'
  | 'name'
  | 'type'
  | 'value';

type AsChildButtonProps = Omit<
  React.ComponentPropsWithoutRef<'button'>,
  keyof ButtonBaseProps | 'children' | ButtonOnlyPropNames
>;

type ButtonSharedContentProps = {
  /** Icon content to render before the button label. */
  startIcon?: ReactNode;

  /** Icon content to render after the button label. */
  endIcon?: ReactNode;
};

export type SlottableChild = ReactElement<{ children?: ReactNode }>;

type IconButtonAccessibleName =
  | {
      /** Accessible label for icon-only buttons. */
      'aria-label': string;
      'aria-labelledby'?: string;
    }
  | {
      /** ID of the element that labels icon-only buttons. */
      'aria-labelledby': string;
      'aria-label'?: string;
    };

type ButtonWithLabelProps = ButtonSharedContentProps & {
  /** Button label or content. */
  children?: ReactNode;

  /** Icon-only content. When provided, children are ignored. */
  icon?: never;
};

type ButtonWithIconProps = IconButtonAccessibleName & {
  /** Button label or content. Ignored when icon is provided. */
  children?: ReactNode;

  /** Icon-only content. When provided, children are ignored. */
  icon: ReactNode;

  /** Use icon for icon-only buttons instead. */
  startIcon?: ReactNode;

  /** Use icon for icon-only buttons instead. */
  endIcon?: ReactNode;
};

type ButtonAsButtonProps = {
  asChild?: false;
  children?: ReactNode;
};

type ButtonAsChildProps = {
  asChild: true;
  children: ReactElement;
};

/** Props for the ThemeShift button component. */
export type ButtonProps =
  | (ButtonBaseProps &
      NativeButtonProps &
      (ButtonWithLabelProps | ButtonWithIconProps) &
      ButtonAsButtonProps)
  | (ButtonBaseProps &
      AsChildButtonProps &
      (ButtonWithLabelProps | ButtonWithIconProps) &
      ButtonAsChildProps);

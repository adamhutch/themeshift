import classNames from 'classnames';

import styles from './Button.module.scss';

export type ButtonSize = 'small' | 'medium' | 'large';
export type ButtonIntent =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'constructive'
  | 'destructive';

export type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  intent?: ButtonIntent;
  size?: ButtonSize;
  visuallyDisabled?: boolean;
} & React.ComponentPropsWithoutRef<'button'>;

const sizeClassMap = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
} satisfies Record<ButtonSize, string>;

const intentClassMap = {
  primary: styles.primary,
  secondary: styles.secondary,
  tertiary: styles.tertiary,
  constructive: styles.constructive,
  destructive: styles.destructive,
} satisfies Record<ButtonIntent, string>;

export const Button = ({
  children,
  className,
  intent = 'primary',
  size = 'medium',
  visuallyDisabled = false,
  ...buttonProps
}: ButtonProps) => (
  <button
    {...buttonProps}
    className={classNames(
      styles.container,
      sizeClassMap[size],
      intentClassMap[intent],
      visuallyDisabled && styles.visuallyDisabled,
      className
    )}
  >
    {children}
  </button>
);

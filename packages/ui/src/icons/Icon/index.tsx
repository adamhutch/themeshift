import classNames from 'classnames';

import styles from './Icon.module.scss';
import type { CSSProperties } from 'react';

export interface IconProps {
  className?: string;
  color?: string;
  fillOpacity?: number;
  size?: number;
  style?: CSSProperties & {
    [key: string]: string | number; // This allows arbitrary string keys
  };
}

interface IconComponentProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  fillOpacity?: number;
  size?: number;
  viewBox: string;
  style?: CSSProperties;
}

export const Icon = ({
  children,
  className,
  color = 'currentColor',
  fillOpacity,
  size = 16,
  viewBox,
  style,
  ...spreadProps
}: IconComponentProps) => (
  <svg
    {...spreadProps}
    className={classNames(styles.icon, className)}
    width={size}
    height={size}
    viewBox={viewBox}
    xmlns="http://www.w3.org/2000/svg"
    style={{
      color,
      fillOpacity,
      ...style,
    }}
  >
    {children}
  </svg>
);

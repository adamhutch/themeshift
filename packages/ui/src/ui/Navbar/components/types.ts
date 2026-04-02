import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

export type PolymorphicProps<T extends ElementType, Props = object> = Props & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof Props | 'as'>;

export type NavbarPosition = 'static' | 'absolute' | 'fixed' | 'sticky';
export type NavbarSectionAlign = 'start' | 'center' | 'end';
export type NavbarSectionDirection = 'row' | 'column';

export type CSSVarStyle = CSSProperties & {
  '--navbar-container-gap'?: CSSProperties['columnGap'];
  '--navbar-max-width'?: CSSProperties['maxWidth'];
  '--navbar-section-gap'?: CSSProperties['gap'];
};

export type NavbarOwnProps = {
  children?: ReactNode;
  className?: string;
  position?: NavbarPosition;
};

export type NavbarContainerOwnProps = {
  children?: ReactNode;
  className?: string;
  gap?: CSSProperties['columnGap'];
  maxWidth?: CSSProperties['maxWidth'];
};

export type NavbarSectionOwnProps = {
  align?: NavbarSectionAlign;
  children?: ReactNode;
  className?: string;
  direction?: NavbarSectionDirection;
  gap?: CSSProperties['gap'];
  wrap?: boolean;
};

export type NavbarProps<T extends ElementType = 'nav'> = PolymorphicProps<
  T,
  NavbarOwnProps
>;

export type NavbarContainerProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  NavbarContainerOwnProps
>;

export type NavbarSectionProps<T extends ElementType = 'div'> = PolymorphicProps<
  T,
  NavbarSectionOwnProps
>;

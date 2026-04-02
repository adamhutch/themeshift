/* eslint-disable react-refresh/only-export-components */
import type { ElementType } from 'react';

import { NavbarContainer } from './components/NavbarContainer';
import { NavbarRoot } from './components/NavbarRoot';
import { NavbarSection } from './components/NavbarSection';
import type {
  NavbarContainerProps,
  NavbarProps,
  NavbarSectionProps,
} from './components/types';

type NavbarComponent = (<T extends ElementType = 'nav'>(
  props: NavbarProps<T>,
) => React.JSX.Element) & {
  Container: typeof NavbarContainer;
  Section: typeof NavbarSection;
};

export const Navbar = Object.assign(NavbarRoot, {
  Container: NavbarContainer,
  Section: NavbarSection,
}) as NavbarComponent;

export { NavbarContainer, NavbarRoot, NavbarSection };
export type { NavbarContainerProps, NavbarProps, NavbarSectionProps };

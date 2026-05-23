/* eslint-disable react-refresh/only-export-components */
import {
  ChipAvatar,
  ChipGroup,
  ChipIcon,
  ChipLabel,
  ChipRemoveButton,
  ChipRoot,
} from './components';

import type { ChipCompoundComponent } from './types';

export const Chip = Object.assign(ChipRoot, {
  Avatar: ChipAvatar,
  Group: ChipGroup,
  Icon: ChipIcon,
  Label: ChipLabel,
  RemoveButton: ChipRemoveButton,
}) as ChipCompoundComponent;

export {
  ChipAvatar,
  ChipGroup,
  ChipIcon,
  ChipLabel,
  ChipRemoveButton,
  ChipRoot,
};

export type {
  ChipAvatarProps,
  ChipColor,
  ChipGroupGap,
  ChipGroupOrientation,
  ChipGroupProps,
  ChipIconProps,
  ChipLabelProps,
  ChipProps,
  ChipRadius,
  ChipRemoveButtonProps,
  ChipRootProps,
  ChipSize,
  ChipVariant,
} from './types';

/* eslint-disable react-refresh/only-export-components */
import {
  FilterChipGroup,
  FilterChipHiddenInput,
  FilterChipRoot,
} from './components';

import type { FilterChipCompoundComponent } from './types';

export const FilterChip = Object.assign(FilterChipRoot, {
  Group: FilterChipGroup,
  HiddenInput: FilterChipHiddenInput,
}) as FilterChipCompoundComponent;

export { FilterChipGroup, FilterChipHiddenInput, FilterChipRoot };

export type {
  FilterChipGroupProps,
  FilterChipGroupType,
  FilterChipGroupValue,
  FilterChipHiddenInputProps,
  FilterChipProps,
  FilterChipRootProps,
} from './types';

import { createContext, useContext } from 'react';

import type { FilterChipGroupType } from '@/components/FilterChip/types';

export type FilterChipGroupContextValue = {
  disabled: boolean;
  selectedValues: string[];
  toggleValue: (value: string) => void;
  type: FilterChipGroupType;
};

export const FilterChipGroupContext =
  createContext<FilterChipGroupContextValue | null>(null);

export function useFilterChipGroupContextOptional() {
  return useContext(FilterChipGroupContext);
}

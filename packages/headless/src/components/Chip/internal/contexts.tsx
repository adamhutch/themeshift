import { createContext, useContext } from 'react';

export type ChipContextValue = {
  disabled: boolean;
  interactive: boolean;
};

export const ChipContext = createContext<ChipContextValue | null>(null);

export function useChipContextOptional() {
  return useContext(ChipContext);
}

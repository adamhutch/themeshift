import { HookDataContext } from './HookDataContext';
import { hookData } from './generated';

type HookDataProviderProps = {
  children: React.ReactNode;
};

export const HookDataProvider = ({ children }: HookDataProviderProps) => (
  <HookDataContext.Provider value={{ hooks: hookData }}>
    {children}
  </HookDataContext.Provider>
);

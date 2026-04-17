import { createContext } from 'react';

import type { HookDataContextValue } from './types';

export const HookDataContext = createContext<HookDataContextValue | null>(null);

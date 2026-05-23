export type AlphaTone = 'neutral' | 'brand';

export type AlphaProps = {
  /** Visual tone for Alpha. */
  tone?: AlphaTone;
  /** Enables active visuals. */
  active?: boolean;
  /** Optional asChild composition. */
  asChild?: boolean;
  /** Numeric count badge. */
  count?: number;
  /** Secondary label text. */
  note?: string;
};

const DEFAULT_NOTE = 'ready';

/** Alpha fixture docs description. */
export const Alpha = ({
  tone = 'neutral',
  active = false,
  asChild = false,
  count = 1,
  note = DEFAULT_NOTE,
}: AlphaProps) => null;

export type CompoundRootProps = {
  /** Compound root size. */
  size?: 'sm' | 'lg';
  /** Optional asChild composition. */
  asChild?: boolean;
};

export type CompoundLabelProps = {
  /** Label emphasis. */
  emphasis?: 'normal' | 'strong';
};

/** Compound root fixture docs description. */
const CompoundRoot = ({ size = 'sm', asChild = false }: CompoundRootProps) =>
  null;

/** Compound label fixture docs description. */
const CompoundLabel = ({ emphasis = 'normal' }: CompoundLabelProps) => null;

export const Compound = Object.assign(CompoundRoot, {
  Label: CompoundLabel,
});

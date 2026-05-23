import { Chip } from '@themeshift/ui/components/Chip';
import { siReact, siTypescript, siVite, type SimpleIcon } from 'simple-icons';

import { ResponsiveStackInline } from '../../components';

const SimpleBrandIcon = ({ icon }: { icon: SimpleIcon }) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    style={{ color: `#${icon.hex}` }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={icon.path} />
  </svg>
);

export const BasicChipSample = () => <Chip>React</Chip>;

export const WithStartIconSample = () => (
  <Chip startIcon={<SimpleBrandIcon icon={siReact} aria-hidden="true" />}>
    React
  </Chip>
);

export const WithAvatarSample = () => (
  <Chip
    avatar={
      <span aria-hidden="true" style={{ fontSize: '0.75em' }}>
        NA
      </span>
    }
  >
    Neil Armstrong
  </Chip>
);

export const ComposedSample = () => (
  <Chip>
    <Chip.Avatar name="Neil Armstrong" />
    <Chip.Label>Neil Armstrong</Chip.Label>
    <Chip.RemoveButton aria-label="Remove Neil Armstrong" />
  </Chip>
);

export const RemovableSample = () => (
  <Chip onRemove={() => undefined} removable removeLabel="Remove React">
    React
  </Chip>
);

export const TruncateSample = () => (
  <div style={{ maxWidth: '12rem' }}>
    <Chip>
      <Chip.Label truncate>
        Extremely long technology name that truncates
      </Chip.Label>
    </Chip>
  </div>
);

export const InteractiveAsChildSample = () => (
  <Chip asChild interactive>
    <button type="button">React</button>
  </Chip>
);

export const GroupSample = () => (
  <Chip.Group aria-label="Technologies">
    <Chip startIcon={<SimpleBrandIcon icon={siReact} />}>React</Chip>
    <Chip startIcon={<SimpleBrandIcon icon={siTypescript} />}>TypeScript</Chip>
    <Chip startIcon={<SimpleBrandIcon icon={siVite} />}>Vite</Chip>
  </Chip.Group>
);

export const VariantAndSizeSample = () => (
  <ResponsiveStackInline
    from="desktop"
    inlineProps={{ align: 'center', justify: 'start', wrap: true }}
    stackProps={{ align: 'start' }}
  >
    <Chip color="accent" variant="subtle">
      Accent subtle
    </Chip>
    <Chip size="medium" variant="outline">
      Outline medium
    </Chip>
    <Chip color="success" size="large" variant="solid">
      Success solid
    </Chip>
  </ResponsiveStackInline>
);

export const RadiusSample = () => (
  <ResponsiveStackInline
    from="desktop"
    inlineProps={{ align: 'center', justify: 'start', wrap: true }}
    stackProps={{ align: 'start' }}
  >
    <Chip radius="none" size="large" variant="outline">
      No radius
    </Chip>
    <Chip radius="medium" size="large" variant="outline">
      Medium radius
    </Chip>
    <Chip radius="large" size="large" variant="outline">
      Large radius
    </Chip>
    <Chip radius="full" size="large" variant="outline">
      Full radius
    </Chip>
  </ResponsiveStackInline>
);

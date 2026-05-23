import {
  BasicChipSample,
  ComposedSample,
  GroupSample,
  InteractiveAsChildSample,
  RadiusSample,
  RemovableSample,
  TruncateSample,
  VariantAndSizeSample,
  WithAvatarSample,
  WithStartIconSample,
} from './samples';

export const basicUsage = {
  code: `<Chip>React</Chip>`,
  label: 'Basic usage',
  sample: <BasicChipSample />,
};

export const withStartIcon = {
  code: `<Chip startIcon={<IconReact aria-hidden="true" />}>
  React
</Chip>`,
  label: 'With start icon',
  sample: <WithStartIconSample />,
};

export const withAvatar = {
  code: `<Chip avatar={<span aria-hidden="true">NA</span>}>
  Neil Armstrong
</Chip>`,
  label: 'With avatar shorthand',
  sample: <WithAvatarSample />,
};

export const composed = {
  code: `<Chip>
  <Chip.Avatar name="Neil Armstrong" />
  <Chip.Label>Neil Armstrong</Chip.Label>
  <Chip.RemoveButton aria-label="Remove Neil Armstrong" />
</Chip>`,
  label: 'Composed primitives',
  sample: <ComposedSample />,
};

export const removable = {
  code: `<Chip removable removeLabel="Remove React" onRemove={handleRemove}>
  React
</Chip>`,
  label: 'Removable',
  sample: <RemovableSample />,
};

export const truncate = {
  code: `<Chip>
  <Chip.Label truncate>
    Extremely long technology name that truncates
  </Chip.Label>
</Chip>`,
  label: 'Truncation',
  sample: <TruncateSample />,
};

export const interactiveAsChild = {
  code: `<Chip interactive asChild>
  <button type="button">React</button>
</Chip>`,
  label: 'Interactive asChild',
  sample: <InteractiveAsChildSample />,
};

export const group = {
  code: `<Chip.Group aria-label="Technologies">
  <Chip startIcon={<IconReact />}>React</Chip>
  <Chip startIcon={<IconTypeScript />}>TypeScript</Chip>
  <Chip startIcon={<IconVite />}>Vite</Chip>
</Chip.Group>`,
  label: 'Group',
  sample: <GroupSample />,
};

export const variantAndSize = {
  code: `<Chip color="accent" variant="subtle">Accent subtle</Chip>
<Chip variant="outline" size="medium">Outline medium</Chip>
<Chip color="success" variant="solid" size="large">Success solid</Chip>`,
  label: 'Variants and sizes',
  sample: <VariantAndSizeSample />,
};

export const radius = {
  code: `<Chip radius="none" size="large" variant="outline">No radius</Chip>
<Chip radius="medium" size="large" variant="outline">Medium radius</Chip>
<Chip radius="large" size="large" variant="outline">Large radius</Chip>
<Chip radius="full" size="large" variant="outline">Full radius</Chip>`,
  label: 'Radius',
  sample: <RadiusSample />,
};

const directionCode = `<Chip startIcon={<IconMinus aria-hidden="true" />}>
  React
</Chip>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: <WithStartIconSample />,
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <WithStartIconSample />
    </div>
  ),
};

export const propHighlights = [
  basicUsage,
  withStartIcon,
  withAvatar,
  removable,
];

export const directionExamples = [directionLTR, directionRTL];

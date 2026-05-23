import {
  BasicFilterChipSample,
  ComposedWithChipSlotsSample,
  ControlledFilterChipSample,
  DirectionSample,
  HiddenInputSample,
  MultipleGroupSample,
  SelectedIconSample,
  SingleGroupSample,
} from './samples';

export const basicUsage = {
  code: `<FilterChip>React</FilterChip>`,
  label: 'Basic usage',
  sample: <BasicFilterChipSample />,
};

export const controlled = {
  code: `const [selected, setSelected] = useState(false);

<FilterChip selected={selected} onSelectedChange={setSelected}>
  React ({selected ? 'selected' : 'not selected'})
</FilterChip>`,
  label: 'Controlled selection',
  sample: <ControlledFilterChipSample />,
};

export const multipleGroup = {
  code: `<FilterChip.Group type="multiple" value={value} onValueChange={setValue}>
  <FilterChip value="react">React</FilterChip>
  <FilterChip value="typescript">TypeScript</FilterChip>
  <FilterChip value="vite">Vite</FilterChip>
</FilterChip.Group>`,
  label: 'Multiple group',
  sample: <MultipleGroupSample />,
};

export const singleGroup = {
  code: `<FilterChip.Group type="single" value={value} onValueChange={setValue}>
  <FilterChip value="react">React</FilterChip>
  <FilterChip value="typescript">TypeScript</FilterChip>
  <FilterChip value="vite">Vite</FilterChip>
</FilterChip.Group>`,
  label: 'Single group',
  sample: <SingleGroupSample />,
};

export const selectedIcons = {
  code: `<FilterChip selectedIcon value="react">React</FilterChip>
<FilterChip selectedIcon={<IconTypeScript />} value="typescript">TypeScript</FilterChip>
<FilterChip hideSelectedIcon selectedIcon value="vite">Vite</FilterChip>
<FilterChip selectedIcon reserveSelectedIconSpace={false} value="svelte">
  No reserved space
</FilterChip>`,
  label: 'Selected icon variants',
  sample: <SelectedIconSample />,
};

export const hiddenInput = {
  code: `<form>
  <FilterChip.Group defaultValue={['react', 'typescript']} type="multiple">
    <FilterChip value="react">React</FilterChip>
    <FilterChip value="typescript">TypeScript</FilterChip>
    <FilterChip value="vite">Vite</FilterChip>
    <FilterChip.HiddenInput name="frameworks" />
  </FilterChip.Group>
</form>`,
  label: 'Hidden input serialization',
  sample: <HiddenInputSample />,
};

export const composed = {
  code: `<FilterChip selectedIcon>
  <Chip.Icon>
    <IconReact aria-hidden="true" />
  </Chip.Icon>
  <Chip.Label>React</Chip.Label>
</FilterChip>`,
  label: 'Composed with Chip slots',
  sample: <ComposedWithChipSlotsSample />,
};

const directionCode = `<FilterChip selectedIcon startIcon={<IconReact aria-hidden="true" />}>
  React
</FilterChip>`;

export const directionLTR = {
  code: directionCode,
  label: 'LTR',
  sample: <DirectionSample />,
};

export const directionRTL = {
  code: directionCode,
  label: 'RTL',
  sample: (
    <div dir="rtl">
      <DirectionSample />
    </div>
  ),
};

export const propHighlights = [basicUsage, composed, controlled, selectedIcons];

export const directionExamples = [directionLTR, directionRTL];

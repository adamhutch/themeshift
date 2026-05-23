import { useState } from 'react';
import { siReact, siTypescript, type SimpleIcon } from 'simple-icons';

import { Chip } from '@themeshift/ui/components/Chip';
import { FilterChip } from '@themeshift/ui/components/FilterChip';

const SimpleBrandIcon = ({
  icon,
  useColor = true,
}: {
  icon: SimpleIcon;
  useColor?: boolean;
}) => (
  <svg
    aria-hidden="true"
    fill="currentColor"
    style={{ color: useColor ? `#${icon.hex}` : 'currentColor' }}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={icon.path} />
  </svg>
);

export const BasicFilterChipSample = () => <FilterChip>React</FilterChip>;

export const ControlledFilterChipSample = () => {
  const [selected, setSelected] = useState(false);

  return (
    <FilterChip onSelectedChange={setSelected} selected={selected}>
      React ({selected ? 'selected' : 'not selected'})
    </FilterChip>
  );
};

export const MultipleGroupSample = () => {
  const [value, setValue] = useState<string[]>(['react']);

  return (
    <FilterChip.Group
      onValueChange={(nextValue) => setValue(nextValue as string[])}
      value={value}
    >
      <FilterChip value="react">React</FilterChip>
      <FilterChip value="typescript">TypeScript</FilterChip>
      <FilterChip value="vite">Vite</FilterChip>
    </FilterChip.Group>
  );
};

export const SingleGroupSample = () => {
  const [value, setValue] = useState('react');

  return (
    <FilterChip.Group
      onValueChange={(nextValue) => setValue(nextValue as string)}
      type="single"
      value={value}
    >
      <FilterChip value="react">React</FilterChip>
      <FilterChip value="typescript">TypeScript</FilterChip>
      <FilterChip value="vite">Vite</FilterChip>
    </FilterChip.Group>
  );
};

export const SelectedIconSample = () => (
  <FilterChip.Group type="multiple">
    <FilterChip selectedIcon value="react">
      React
    </FilterChip>
    <FilterChip
      selectedIcon={
        <SimpleBrandIcon
          icon={siTypescript}
          aria-hidden="true"
          useColor={false}
        />
      }
      value="typescript"
    >
      TypeScript
    </FilterChip>
    <FilterChip hideSelectedIcon selectedIcon value="vite">
      Vite
    </FilterChip>
    <FilterChip reserveSelectedIconSpace={false} selectedIcon value="svelte">
      No reserved space
    </FilterChip>
  </FilterChip.Group>
);

export const HiddenInputSample = () => (
  <form>
    <FilterChip.Group defaultValue={['react', 'typescript']} type="multiple">
      <FilterChip value="react">React</FilterChip>
      <FilterChip value="typescript">TypeScript</FilterChip>
      <FilterChip value="vite">Vite</FilterChip>
      <FilterChip.HiddenInput name="frameworks" />
    </FilterChip.Group>
  </form>
);

export const ComposedWithChipSlotsSample = () => (
  <FilterChip selectedIcon value="react">
    <Chip.Icon>
      <SimpleBrandIcon icon={siReact} aria-hidden="true" />
    </Chip.Icon>
    <Chip.Label>React</Chip.Label>
  </FilterChip>
);

export const DirectionSample = () => (
  <FilterChip
    selectedIcon
    startIcon={<SimpleBrandIcon icon={siReact} aria-hidden="true" />}
  >
    React
  </FilterChip>
);

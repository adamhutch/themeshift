import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from '@/components/Chip';
import { IconMinus } from '@/icons';

import { FilterChip } from './index';
import styles from './FilterChip.module.scss';

describe('FilterChip', () => {
  it('exposes compound members', () => {
    expect(FilterChip.Group).toBeDefined();
    expect(FilterChip.HiddenInput).toBeDefined();
  });

  it('renders a native button by default and toggles aria-pressed', async () => {
    const user = userEvent.setup();

    render(<FilterChip>React</FilterChip>);

    const chip = screen.getByRole('button', { name: 'React' });

    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    await user.click(chip);

    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('data-selected', 'true');
  });

  it('supports selectedIcon defaults and overrides', async () => {
    const user = userEvent.setup();

    render(
      <>
        <FilterChip selectedIcon>React</FilterChip>
        <FilterChip selectedIcon={<IconMinus data-testid="custom-icon" />}>
          TypeScript
        </FilterChip>
      </>
    );

    const react = screen.getByRole('button', { name: 'React' });
    const typescript = screen.getByRole('button', { name: 'TypeScript' });

    expect(react.querySelector('svg')).not.toBeNull();
    expect(screen.getAllByTestId('custom-icon')).toHaveLength(2);

    await user.click(react);
    await user.click(typescript);

    expect(react).toHaveAttribute('data-selected', 'true');
    expect(typescript).toHaveAttribute('data-selected', 'true');
  });

  it('honors hideSelectedIcon even when selectedIcon is true', () => {
    render(
      <FilterChip hideSelectedIcon selectedIcon>
        React
      </FilterChip>
    );

    const chip = screen.getByRole('button', { name: 'React' });

    expect(chip.querySelector(`.${styles.selectedIcon}`)).toBeNull();
  });

  it('supports shorthand composition and Chip slots without duplicate shorthand slots', () => {
    render(
      <FilterChip
        endIcon={<IconMinus data-testid="end-icon-shorthand" />}
        selectedIcon
        startIcon={<IconMinus data-testid="start-icon-shorthand" />}
      >
        <Chip.Icon position="start">
          <IconMinus data-testid="start-icon-slot" />
        </Chip.Icon>
        <Chip.Label>React</Chip.Label>
      </FilterChip>
    );

    expect(screen.getByTestId('start-icon-slot')).toBeInTheDocument();
    expect(
      screen.queryByTestId('start-icon-shorthand')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('end-icon-shorthand')).toBeInTheDocument();
  });

  it('supports grouped behavior and hidden input serialization', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <form>
        <FilterChip.Group onValueChange={onValueChange} type="multiple">
          <FilterChip value="react">React</FilterChip>
          <FilterChip value="typescript">TypeScript</FilterChip>
          <FilterChip.HiddenInput name="frameworks" />
        </FilterChip.Group>
      </form>
    );

    await user.click(screen.getByRole('button', { name: 'React' }));

    expect(onValueChange).toHaveBeenLastCalledWith(['react']);
    expect(screen.getByDisplayValue('react')).toHaveAttribute(
      'name',
      'frameworks'
    );
  });

  it('supports direction-aware rendering in LTR and RTL contexts', () => {
    const { rerender } = render(
      <div dir="ltr">
        <FilterChip startIcon={<IconMinus data-testid="ltr-icon" />}>
          React
        </FilterChip>
      </div>
    );

    expect(screen.getByTestId('ltr-icon')).toBeInTheDocument();

    rerender(
      <div dir="rtl">
        <FilterChip startIcon={<IconMinus data-testid="rtl-icon" />}>
          React
        </FilterChip>
      </div>
    );

    expect(screen.getByTestId('rtl-icon')).toBeInTheDocument();
  });

  it('warns when asChild uses non-button semantics', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <FilterChip asChild>
        <a href="/react">React</a>
      </FilterChip>
    );

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <FilterChip.Group aria-label="Framework filters" type="multiple">
        <FilterChip selectedIcon value="react">
          React
        </FilterChip>
        <FilterChip value="typescript">TypeScript</FilterChip>
      </FilterChip.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

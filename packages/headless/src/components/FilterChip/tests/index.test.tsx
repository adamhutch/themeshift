import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { FilterChip } from '../index';

describe('FilterChip (headless)', () => {
  it('exposes compound members', () => {
    expect(FilterChip.Group).toBeDefined();
    expect(FilterChip.HiddenInput).toBeDefined();
  });

  it('renders a native button and manages uncontrolled selection', async () => {
    const user = userEvent.setup();

    render(<FilterChip>React</FilterChip>);

    const chip = screen.getByRole('button', { name: 'React' });

    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('aria-pressed', 'false');

    await user.click(chip);

    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports controlled selection state', async () => {
    const user = userEvent.setup();
    const onSelectedChange = vi.fn();

    const { rerender } = render(
      <FilterChip onSelectedChange={onSelectedChange} selected={false}>
        React
      </FilterChip>
    );

    const chip = screen.getByRole('button', { name: 'React' });

    await user.click(chip);

    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(onSelectedChange).toHaveBeenCalledWith(true);

    rerender(
      <FilterChip onSelectedChange={onSelectedChange} selected={true}>
        React
      </FilterChip>
    );

    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('supports keyboard toggling with Enter and Space', async () => {
    const user = userEvent.setup();

    render(<FilterChip>React</FilterChip>);

    const chip = screen.getByRole('button', { name: 'React' });

    chip.focus();

    await user.keyboard('{Enter}');
    expect(chip).toHaveAttribute('aria-pressed', 'true');

    await user.keyboard(' ');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
  });

  it('supports uncontrolled multiple-group behavior', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <FilterChip.Group onValueChange={onValueChange}>
        <FilterChip value="react">React</FilterChip>
        <FilterChip value="typescript">TypeScript</FilterChip>
      </FilterChip.Group>
    );

    const react = screen.getByRole('button', { name: 'React' });
    const typescript = screen.getByRole('button', { name: 'TypeScript' });

    await user.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['react']);

    await user.click(typescript);
    expect(typescript).toHaveAttribute('aria-pressed', 'true');
    expect(onValueChange).toHaveBeenLastCalledWith(['react', 'typescript']);

    await user.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'false');
    expect(onValueChange).toHaveBeenLastCalledWith(['typescript']);
  });

  it('supports single-group behavior with toggle-off', async () => {
    const user = userEvent.setup();

    render(
      <FilterChip.Group defaultValue="react" type="single">
        <FilterChip value="react">React</FilterChip>
        <FilterChip value="typescript">TypeScript</FilterChip>
      </FilterChip.Group>
    );

    const react = screen.getByRole('button', { name: 'React' });
    const typescript = screen.getByRole('button', { name: 'TypeScript' });

    expect(react).toHaveAttribute('aria-pressed', 'true');

    await user.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'false');

    await user.click(typescript);
    expect(typescript).toHaveAttribute('aria-pressed', 'true');
  });

  it('propagates disabled state from group and root', async () => {
    const user = userEvent.setup();

    render(
      <>
        <FilterChip disabled>Standalone</FilterChip>
        <FilterChip.Group disabled>
          <FilterChip value="react">React</FilterChip>
        </FilterChip.Group>
      </>
    );

    const standalone = screen.getByRole('button', { name: 'Standalone' });
    const grouped = screen.getByRole('button', { name: 'React' });

    expect(standalone).toBeDisabled();
    expect(grouped).toBeDisabled();

    await user.click(grouped);
    expect(grouped).toHaveAttribute('aria-pressed', 'false');
  });

  it('warns and does not participate in group selection when value is missing', async () => {
    const user = userEvent.setup();
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    render(
      <FilterChip.Group>
        <FilterChip>Missing value</FilterChip>
        <FilterChip value="react">React</FilterChip>
      </FilterChip.Group>
    );

    const missing = screen.getByRole('button', { name: 'Missing value' });
    const react = screen.getByRole('button', { name: 'React' });

    await user.click(missing);
    expect(missing).toHaveAttribute('aria-pressed', 'true');

    await user.click(react);
    expect(react).toHaveAttribute('aria-pressed', 'true');

    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('serializes HiddenInput values for single and multiple groups', async () => {
    const user = userEvent.setup();

    const { rerender } = render(
      <form data-testid="single-form">
        <FilterChip.Group defaultValue="react" type="single">
          <FilterChip value="react">React</FilterChip>
          <FilterChip.HiddenInput name="framework" />
        </FilterChip.Group>
      </form>
    );

    const singleInput = screen.getByDisplayValue('react');

    expect(singleInput).toHaveAttribute('name', 'framework');

    await user.click(screen.getByRole('button', { name: 'React' }));
    expect(screen.queryByDisplayValue('react')).not.toBeInTheDocument();

    rerender(
      <form data-testid="multiple-form">
        <FilterChip.Group type="multiple" value={['react', 'typescript']}>
          <FilterChip value="react">React</FilterChip>
          <FilterChip value="typescript">TypeScript</FilterChip>
          <FilterChip.HiddenInput name="frameworks" />
        </FilterChip.Group>
      </form>
    );

    const multipleInputs = screen.getAllByDisplayValue(/react|typescript/);

    expect(multipleInputs).toHaveLength(2);
    multipleInputs.forEach((input) => {
      expect(input).toHaveAttribute('name', 'frameworks');
      expect(input).toHaveAttribute('type', 'hidden');
    });
  });

  it('supports asChild composition and throws on invalid usage', () => {
    const { rerender } = render(
      <FilterChip asChild>
        <a href="/react">React</a>
      </FilterChip>
    );

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false'
    );

    expect(() => {
      rerender(<FilterChip asChild>React</FilterChip>);
    }).toThrowError(
      'ThemeShift FilterChip with asChild expects a single React element child.'
    );
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <FilterChip.Group aria-label="Framework filters" type="multiple">
        <FilterChip value="react">React</FilterChip>
        <FilterChip value="typescript">TypeScript</FilterChip>
      </FilterChip.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

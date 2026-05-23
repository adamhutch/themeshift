import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { IconMinus } from '@/icons';

import { Chip } from './index';
import styles from './Chip.module.scss';

describe('Chip', () => {
  it('exposes compound members', () => {
    expect(Chip.Label).toBeDefined();
    expect(Chip.Icon).toBeDefined();
    expect(Chip.Avatar).toBeDefined();
    expect(Chip.RemoveButton).toBeDefined();
    expect(Chip.Group).toBeDefined();
  });

  it('supports simple shorthand usage', () => {
    render(<Chip>React</Chip>);

    const chip = screen.getByText('React').closest(`.${styles.root}`);

    expect(chip).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveClass(styles.label);
  });

  it('supports shorthand avatar and icon composition', () => {
    render(
      <>
        <Chip avatar={<span data-testid="avatar-content">A</span>}>Avatar</Chip>
        <Chip startIcon={<IconMinus data-testid="start-icon" />}>Icon</Chip>
      </>
    );

    expect(screen.getByTestId('avatar-content')).toBeInTheDocument();
    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
  });

  it('renders default remove icon and calls onRemove', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <Chip onRemove={onRemove} removable removeLabel="Remove React">
        React
      </Chip>
    );

    const removeButton = screen.getByRole('button', { name: 'Remove React' });

    expect(removeButton.querySelector('svg')).not.toBeNull();

    await user.click(removeButton);

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('uses compound slots instead of duplicating shorthand equivalents', () => {
    render(
      <Chip
        endIcon={<IconMinus data-testid="end-icon-shorthand" />}
        removable
        removeLabel="Remove React"
        startIcon={<IconMinus data-testid="start-icon-shorthand" />}
      >
        <Chip.Icon position="start">
          <IconMinus data-testid="start-icon-slot" />
        </Chip.Icon>
        <Chip.Label>React</Chip.Label>
        <Chip.RemoveButton aria-label="Remove slot">
          <span data-testid="remove-slot">x</span>
        </Chip.RemoveButton>
      </Chip>
    );

    expect(screen.getByTestId('start-icon-slot')).toBeInTheDocument();
    expect(
      screen.queryByTestId('start-icon-shorthand')
    ).not.toBeInTheDocument();
    expect(screen.queryByTestId('end-icon-shorthand')).toBeInTheDocument();
    expect(screen.getByTestId('remove-slot')).toBeInTheDocument();
    expect(screen.queryByLabelText('Remove React')).not.toBeInTheDocument();
  });

  it('renders a button when interactive is true and supports asChild', () => {
    const { rerender } = render(<Chip interactive>React</Chip>);

    expect(screen.getByRole('button', { name: 'React' })).toBeInTheDocument();

    rerender(
      <Chip asChild interactive>
        <a href="/react">React link</a>
      </Chip>
    );

    expect(screen.getByRole('link', { name: 'React link' })).toHaveAttribute(
      'href',
      '/react'
    );
  });

  it('disables remove buttons when chip is disabled', () => {
    render(
      <Chip disabled removable removeLabel="Remove React">
        React
      </Chip>
    );

    const removeButton = screen.getByRole('button', { name: 'Remove React' });

    expect(removeButton).toBeDisabled();
  });

  it('supports the none radius variant', () => {
    render(
      <Chip data-testid="chip-none-radius" radius="none">
        React
      </Chip>
    );

    expect(screen.getByTestId('chip-none-radius')).toHaveClass(
      styles.radiusNone
    );
  });

  it('applies truncation styles on Chip.Label', () => {
    render(
      <Chip>
        <Chip.Label truncate>Extremely long technology name</Chip.Label>
      </Chip>
    );

    expect(screen.getByText('Extremely long technology name')).toHaveClass(
      styles.truncate
    );
  });

  it('supports direction-aware rendering in LTR and RTL contexts', () => {
    const { rerender } = render(
      <div dir="ltr">
        <Chip startIcon={<IconMinus data-testid="ltr-icon" />}>React</Chip>
      </div>
    );

    expect(screen.getByTestId('ltr-icon')).toBeInTheDocument();

    rerender(
      <div dir="rtl">
        <Chip startIcon={<IconMinus data-testid="rtl-icon" />}>React</Chip>
      </div>
    );

    expect(screen.getByTestId('rtl-icon')).toBeInTheDocument();
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <Chip.Group aria-label="Technologies">
        <Chip startIcon={<IconMinus aria-hidden="true" />}>React</Chip>
        <Chip removable removeLabel="Remove TypeScript">
          TypeScript
        </Chip>
      </Chip.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

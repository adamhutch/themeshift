import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';

import { Chip } from '../index';

describe('Chip (headless)', () => {
  it('exposes compound members', () => {
    expect(Chip.Label).toBeDefined();
    expect(Chip.Icon).toBeDefined();
    expect(Chip.Avatar).toBeDefined();
    expect(Chip.RemoveButton).toBeDefined();
    expect(Chip.Group).toBeDefined();
  });

  it('renders a span by default', () => {
    render(<Chip data-testid="chip">React</Chip>);

    expect(screen.getByTestId('chip')).toHaveProperty('tagName', 'SPAN');
  });

  it('renders a native button when interactive is true', () => {
    render(
      <Chip interactive>
        <Chip.Label>React</Chip.Label>
      </Chip>
    );

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('supports asChild and throws on invalid child usage', () => {
    const { rerender } = render(
      <Chip asChild>
        <a href="/react">React</a>
      </Chip>
    );

    expect(screen.getByRole('link', { name: 'React' })).toHaveAttribute(
      'href',
      '/react'
    );

    expect(() => {
      rerender(<Chip asChild>React</Chip>);
    }).toThrowError(
      'ThemeShift Chip with asChild expects a single React element child.'
    );
  });

  it('propagates disabled behavior to remove button', () => {
    render(
      <Chip disabled>
        <Chip.Label>React</Chip.Label>
        <Chip.RemoveButton aria-label="Remove React">x</Chip.RemoveButton>
      </Chip>
    );

    expect(screen.getByRole('button', { name: 'Remove React' })).toBeDisabled();
  });

  it('stops propagation by default on remove button clicks', async () => {
    const user = userEvent.setup();
    const onRootClick = vi.fn();
    const onRemoveClick = vi.fn();

    render(
      <Chip interactive onClick={onRootClick}>
        <Chip.Label>React</Chip.Label>
        <Chip.RemoveButton aria-label="Remove React" onClick={onRemoveClick}>
          x
        </Chip.RemoveButton>
      </Chip>
    );

    await user.click(screen.getByRole('button', { name: 'Remove React' }));

    expect(onRemoveClick).toHaveBeenCalledTimes(1);
    expect(onRootClick).not.toHaveBeenCalled();
  });

  it('treats icons as decorative by default and supports accessible labeling', () => {
    const { rerender } = render(
      <Chip.Icon data-testid="icon">
        <svg />
      </Chip.Icon>
    );

    expect(screen.getByTestId('icon')).toHaveAttribute('aria-hidden', 'true');

    rerender(
      <Chip.Icon aria-label="React logo" decorative={false}>
        <svg />
      </Chip.Icon>
    );

    expect(screen.getByLabelText('React logo')).toBeInTheDocument();
  });

  it('supports layout-only group behavior and aria passthrough', () => {
    render(
      <Chip.Group
        aria-label="Technologies"
        data-testid="group"
        gap="medium"
        orientation="vertical"
        wrap={false}
      >
        <Chip>React</Chip>
        <Chip>TypeScript</Chip>
      </Chip.Group>
    );

    const group = screen.getByTestId('group');

    expect(group).toHaveAttribute('role', 'group');
    expect(group).toHaveAttribute('aria-label', 'Technologies');
    expect(group).toHaveAttribute('data-gap', 'medium');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    expect(group).not.toHaveAttribute('data-wrap');
  });

  it('has no obvious accessibility violations', async () => {
    const { container } = render(
      <Chip.Group aria-label="Technologies">
        <Chip>
          <Chip.Icon>
            <svg />
          </Chip.Icon>
          <Chip.Label>React</Chip.Label>
          <Chip.RemoveButton aria-label="Remove React">x</Chip.RemoveButton>
        </Chip>
      </Chip.Group>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

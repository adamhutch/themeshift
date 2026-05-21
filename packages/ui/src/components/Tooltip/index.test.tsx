import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import { Tooltip } from './index';
import styles from './Tooltip.module.scss';

describe('Tooltip (UI wrapper)', () => {
  it('exposes compound members', () => {
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Content).toBeDefined();
    expect(Tooltip.Arrow).toBeDefined();
    expect(Tooltip.Provider).toBeDefined();
  });

  it('supports convenience usage with content prop', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Convenience tooltip" delay={0}>
        <button type="button">Convenience trigger</button>
      </Tooltip>
    );

    await user.hover(
      screen.getByRole('button', { name: 'Convenience trigger' })
    );

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent(
        'Convenience tooltip'
      );
    });
  });

  it('supports compound usage when content is undefined', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>Compound trigger</Tooltip.Trigger>
        <Tooltip.Content>Compound tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    await user.hover(screen.getByRole('button', { name: 'Compound trigger' }));

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Compound tooltip');
    });
  });

  it('throws for convenience usage when trigger child is not an element', () => {
    expect(() =>
      render(<Tooltip content="Broken">Not an element child</Tooltip>)
    ).toThrow(
      'Tooltip convenience usage expects a single React element child trigger.'
    );
  });

  it('uses UI wrapper classes for content and arrow', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="Styled tooltip" delay={0}>
        <button type="button">Styled trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'Styled trigger' }));

    const tooltip = await screen.findByRole('tooltip');
    const arrow = document.querySelector(
      '[aria-hidden="true"][data-placement]'
    );

    expect(tooltip).toHaveClass(styles.content);
    expect(arrow).toHaveClass(styles.arrow);
  });

  it('does not render arrow in convenience mode when showArrow is false', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip content="No arrow tooltip" delay={0} showArrow={false}>
        <button type="button">No arrow trigger</button>
      </Tooltip>
    );

    await user.hover(screen.getByRole('button', { name: 'No arrow trigger' }));

    await screen.findByRole('tooltip');

    const arrow = document.querySelector(
      '[aria-hidden="true"][data-placement]'
    );
    expect(arrow).not.toBeInTheDocument();
  });

  it('has no accessibility violations for convenience usage', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <Tooltip content="Accessible tooltip" delay={0}>
        <button type="button">Accessibility trigger</button>
      </Tooltip>
    );

    await user.hover(
      screen.getByRole('button', { name: 'Accessibility trigger' })
    );

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    expect(await axe(container)).toHaveNoViolations();
  });
});

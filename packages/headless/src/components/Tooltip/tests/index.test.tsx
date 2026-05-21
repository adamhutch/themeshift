import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Tooltip } from '../index';

function wait(duration: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}

describe('Tooltip', () => {
  it('exposes compound members', () => {
    expect(Tooltip.Root).toBeDefined();
    expect(Tooltip.Trigger).toBeDefined();
    expect(Tooltip.Content).toBeDefined();
    expect(Tooltip.Arrow).toBeDefined();
    expect(Tooltip.Provider).toBeDefined();
  });

  it('opens on hover after delay and closes after closeDelay', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Root closeDelay={30} delay={40}>
        <Tooltip.Trigger>Delete</Tooltip.Trigger>
        <Tooltip.Content>Delete project</Tooltip.Content>
      </Tooltip.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Delete' });

    await user.hover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Delete project');
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports controlled mode', async () => {
    const ControlledTooltip = () => {
      const [open, setOpen] = useState(false);

      return (
        <>
          <button onClick={() => setOpen((value) => !value)} type="button">
            Toggle
          </button>
          <Tooltip.Root onOpenChange={setOpen} open={open}>
            <Tooltip.Trigger>Controlled trigger</Tooltip.Trigger>
            <Tooltip.Content>Controlled tooltip</Tooltip.Content>
          </Tooltip.Root>
        </>
      );
    };

    const user = userEvent.setup();
    render(<ControlledTooltip />);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Toggle' }));

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('calls onOpenChange for trigger interactions in controlled mode', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    render(
      <Tooltip.Root delay={0} onOpenChange={onOpenChange} open={false}>
        <Tooltip.Trigger>Controlled trigger</Tooltip.Trigger>
        <Tooltip.Content>Controlled tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Controlled trigger' });

    await user.hover(trigger);
    expect(onOpenChange).toHaveBeenCalledWith(true);

    await user.unhover(trigger);
    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('supports provider skip-delay behavior and expiry reset', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Provider closeDelay={0} delay={120} skipDelayDuration={80}>
        <Tooltip.Root>
          <Tooltip.Trigger>One trigger</Tooltip.Trigger>
          <Tooltip.Content>One</Tooltip.Content>
        </Tooltip.Root>
        <Tooltip.Root>
          <Tooltip.Trigger>Two trigger</Tooltip.Trigger>
          <Tooltip.Content>Two</Tooltip.Content>
        </Tooltip.Root>
      </Tooltip.Provider>
    );

    const one = screen.getByRole('button', { name: 'One trigger' });
    const two = screen.getByRole('button', { name: 'Two trigger' });

    await user.hover(one);
    expect(await screen.findByRole('tooltip')).toHaveTextContent('One');

    await user.unhover(one);
    await user.hover(two);

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('Two');
    });

    await user.unhover(two);
    await wait(120);

    await user.hover(one);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByRole('tooltip')).toHaveTextContent('One');
    });
  });

  it('wires aria-describedby and role/id semantics', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Root delay={0} id="tooltip-id">
        <Tooltip.Trigger>Aria trigger</Tooltip.Trigger>
        <Tooltip.Content>Aria tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Aria trigger' });

    expect(trigger).not.toHaveAttribute('aria-describedby');

    await user.hover(trigger);

    const tooltip = await screen.findByRole('tooltip');

    expect(tooltip).toHaveAttribute('id', 'tooltip-id');
    expect(trigger).toHaveAttribute('aria-describedby', 'tooltip-id');
  });

  it('closes on Escape', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>Esc trigger</Tooltip.Trigger>
        <Tooltip.Content>Esc tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    await user.hover(screen.getByRole('button', { name: 'Esc trigger' }));
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
  });

  it('supports portal={false}', async () => {
    const user = userEvent.setup();

    const { container } = render(
      <div data-testid="local-container">
        <Tooltip.Root delay={0} portal={false}>
          <Tooltip.Trigger>Local trigger</Tooltip.Trigger>
          <Tooltip.Content>Local tooltip</Tooltip.Content>
        </Tooltip.Root>
      </div>
    );

    await user.hover(screen.getByRole('button', { name: 'Local trigger' }));

    const tooltip = await screen.findByRole('tooltip');

    expect(container).toContainElement(tooltip);
  });

  it('renders tooltip content in provided portal container', async () => {
    const user = userEvent.setup();
    const portalContainer = document.createElement('div');

    document.body.append(portalContainer);

    try {
      render(
        <Tooltip.Root delay={0} portalContainer={portalContainer}>
          <Tooltip.Trigger>Portaled trigger</Tooltip.Trigger>
          <Tooltip.Content>Portaled tooltip</Tooltip.Content>
        </Tooltip.Root>
      );

      await user.hover(
        screen.getByRole('button', { name: 'Portaled trigger' })
      );

      const tooltip = await screen.findByRole('tooltip');

      expect(portalContainer).toContainElement(tooltip);
    } finally {
      portalContainer.remove();
    }
  });

  it('does not open on touch pointer events', async () => {
    render(
      <Tooltip.Root delay={0}>
        <Tooltip.Trigger>Touch trigger</Tooltip.Trigger>
        <Tooltip.Content>Touch tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    const trigger = screen.getByRole('button', { name: 'Touch trigger' });

    fireEvent.pointerEnter(trigger, { pointerType: 'touch' });
    await wait(20);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('throws when using Trigger asChild without child element', () => {
    expect(() =>
      render(
        <Tooltip.Root delay={0}>
          <Tooltip.Trigger asChild />
          <Tooltip.Content>Missing child</Tooltip.Content>
        </Tooltip.Root>
      )
    ).toThrow('Tooltip.Trigger with asChild expects a single child element.');
  });

  it('clears pending timers when unmounted', async () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();

    const { unmount } = render(
      <Tooltip.Root delay={120}>
        <Tooltip.Trigger>Unmount trigger</Tooltip.Trigger>
        <Tooltip.Content>Unmount tooltip</Tooltip.Content>
      </Tooltip.Root>
    );

    await user.hover(screen.getByRole('button', { name: 'Unmount trigger' }));
    unmount();
    await wait(180);

    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

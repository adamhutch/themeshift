import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Menu } from './index';
import styles from './Menu.module.scss';

describe('Menu (UI wrapper)', () => {
  it('supports the compound API', () => {
    expect(Menu.Root).toBeDefined();
    expect(Menu.Content).toBeDefined();
    expect(Menu.Viewport).toBeDefined();
    expect(Menu.Group).toBeDefined();
    expect(Menu.Label).toBeDefined();
    expect(Menu.Item).toBeDefined();
    expect(Menu.ItemText).toBeDefined();
    expect(Menu.ItemIcon).toBeDefined();
    expect(Menu.ItemMeta).toBeDefined();
    expect(Menu.Separator).toBeDefined();
    expect(Menu.CheckboxItem).toBeDefined();
    expect(Menu.RadioGroup).toBeDefined();
    expect(Menu.RadioItem).toBeDefined();
    expect(Menu.ItemIndicator).toBeDefined();
    expect(Menu.Sub).toBeDefined();
    expect(Menu.SubTrigger).toBeDefined();
    expect(Menu.SubContent).toBeDefined();
  });

  it('applies wrapper classes for root/content/item and submenu content', () => {
    render(
      <Menu.Root
        data-testid="menu-root"
        defaultOpen
        density="compact"
        orientation="horizontal"
        size="large"
      >
        <Menu.Content
          aria-label="Actions"
          data-testid="menu-content"
          mode="floating"
        >
          <Menu.Viewport data-testid="menu-viewport" scrollable={false}>
            <Menu.Item destructive highlighted inset>
              <Menu.ItemText>Rename</Menu.ItemText>
            </Menu.Item>
            <Menu.CheckboxItem checked>
              <Menu.ItemIndicator data-testid="menu-indicator" position="end">
                ✓
              </Menu.ItemIndicator>
              <Menu.ItemText>Enabled</Menu.ItemText>
            </Menu.CheckboxItem>
          </Menu.Viewport>

          <Menu.Sub defaultOpen>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent
              aria-label="More tools"
              data-testid="submenu-content"
            >
              <Menu.Item>Duplicate</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    expect(screen.getByTestId('menu-root')).toHaveClass(
      styles.root,
      styles.densityCompact,
      styles.orientationHorizontal,
      styles.sizeLg
    );
    expect(screen.getByTestId('menu-content')).toHaveClass(
      styles.content,
      styles.floating
    );
    expect(screen.getByTestId('menu-viewport')).not.toHaveClass(
      styles.scrollable
    );
    expect(screen.getByTestId('menu-indicator')).toHaveClass(
      styles.indicatorEnd
    );
    expect(screen.getByTestId('submenu-content')).toHaveClass(
      styles.content,
      styles.floating
    );
  });

  it('supports controlled open lifecycle smoke', () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Menu.Root onOpenChange={onOpenChange} open>
        <Menu.Content aria-label="Actions">Hello</Menu.Content>
      </Menu.Root>
    );

    expect(screen.getByText('Hello')).toBeInTheDocument();

    rerender(
      <Menu.Root onOpenChange={onOpenChange} open={false}>
        <Menu.Content aria-label="Actions">Hello</Menu.Content>
      </Menu.Root>
    );

    expect(screen.queryByText('Hello')).not.toBeInTheDocument();
  });

  it('supports critical-path keyboard traversal', async () => {
    const user = userEvent.setup();

    render(
      <>
        <button type="button">Before</button>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="Submenu intent handling">
            <Menu.Sub>
              <Menu.SubTrigger>More tools</Menu.SubTrigger>
              <Menu.SubContent aria-label="More tools">
                <Menu.Item>Rename</Menu.Item>
              </Menu.SubContent>
            </Menu.Sub>
          </Menu.Content>
        </Menu.Root>

        <Menu.Root closeOnSelect={false} defaultOpen>
          <Menu.Content aria-label="asChild link item">
            <Menu.Item asChild>
              <a href="/settings">Settings</a>
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </>
    );

    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('menuitem', { name: /More tools/ })).toHaveFocus();

    await user.tab();
    expect(screen.getByRole('menuitem', { name: /Settings/ })).toHaveFocus();
  });

  it('supports critical-path submenu interaction', async () => {
    const user = userEvent.setup();

    render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Sub closeDelay={0} openDelay={0} openOnHover>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    await user.hover(screen.getByRole('menuitem', { name: 'More tools' }));

    await waitFor(() => {
      expect(
        screen.getByRole('menu', { name: 'More tools' })
      ).toBeInTheDocument();
    });
  });

  it('closes on Escape by default', () => {
    render(
      <Menu.Root defaultOpen>
        <Menu.Content aria-label="Actions" data-testid="content">
          <Menu.Item>Profile</Menu.Item>
        </Menu.Content>
      </Menu.Root>
    );

    fireEvent.keyDown(screen.getByTestId('content'), { key: 'Escape' });

    expect(
      screen.queryByRole('menu', { name: 'Actions' })
    ).not.toBeInTheDocument();
  });

  it('has no accessibility violations for representative wrapper usage', async () => {
    const { container } = render(
      <Menu.Root closeOnSelect={false} defaultOpen>
        <Menu.Content aria-label="Actions">
          <Menu.Label>Account</Menu.Label>
          <Menu.Item>Profile</Menu.Item>
          <Menu.Separator />
          <Menu.Sub>
            <Menu.SubTrigger>More tools</Menu.SubTrigger>
            <Menu.SubContent aria-label="More tools">
              <Menu.Item>Rename</Menu.Item>
            </Menu.SubContent>
          </Menu.Sub>
        </Menu.Content>
      </Menu.Root>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Tabs } from './index';
import styles from './Tabs.module.scss';

describe('Tabs (UI wrapper)', () => {
  it('exposes compound members', () => {
    expect(Tabs.List).toBeDefined();
    expect(Tabs.Trigger).toBeDefined();
    expect(Tabs.Panels).toBeDefined();
    expect(Tabs.Panel).toBeDefined();
    expect(Tabs.Indicator).toBeDefined();
  });

  it('applies wrapper classes to primitives and indicator presets', async () => {
    render(
      <Tabs data-testid="tabs-root" defaultValue="overview">
        <Tabs.List aria-label="Sections" data-testid="tabs-list">
          <Tabs.Indicator
            data-testid="tabs-indicator"
            inset="medium"
            size="large"
            transition
          />
          <Tabs.Trigger data-testid="tabs-trigger" value="overview">
            Overview
          </Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel data-testid="tabs-panel" value="overview">
          Overview panel
        </Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-root')).toHaveClass(styles.root);
    expect(screen.getByTestId('tabs-list')).toHaveClass(styles.list);
    expect(screen.getByTestId('tabs-trigger')).toHaveClass(styles.trigger);
    expect(screen.getByTestId('tabs-panel')).toHaveClass(styles.panel);

    await waitFor(() => {
      expect(screen.getByTestId('tabs-indicator')).toHaveAttribute(
        'data-state',
        'visible'
      );
    });

    expect(screen.getByTestId('tabs-indicator')).toHaveClass(
      styles.indicator,
      styles.indicatorInsetMedium,
      styles.indicatorSizeLarge,
      styles.indicatorTransition
    );
  });

  it('supports polymorphic rendering and pass-through attributes', () => {
    render(
      <Tabs as="section" data-testid="tabs-root">
        <Tabs.List aria-label="Sections" as="nav" data-testid="tabs-list">
          <Tabs.Trigger
            as="a"
            data-testid="tabs-trigger"
            href="#overview"
            value="overview"
          >
            Overview
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panels as="section" data-testid="tabs-panels">
          <Tabs.Panel as="article" data-testid="tabs-panel" value="overview">
            Overview panel
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    );

    expect(screen.getByTestId('tabs-root')).toHaveProperty(
      'tagName',
      'SECTION'
    );
    expect(screen.getByTestId('tabs-list')).toHaveProperty('tagName', 'NAV');
    expect(screen.getByTestId('tabs-trigger')).toHaveProperty('tagName', 'A');
    expect(screen.getByTestId('tabs-panels')).toHaveProperty(
      'tagName',
      'SECTION'
    );
    expect(screen.getByTestId('tabs-panel')).toHaveProperty(
      'tagName',
      'ARTICLE'
    );
  });

  it('supports critical-path selection and panel visibility', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');

    await user.click(screen.getByRole('tab', { name: 'Reports' }));

    expect(screen.getByRole('tabpanel')).toHaveTextContent('Reports panel');
  });

  it('supports critical-path keyboard navigation', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('[ArrowRight]');

    expect(screen.getByRole('tab', { name: 'Reports' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Reports panel');
  });

  it('supports controlled smoke via onValueChange', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Tabs onValueChange={onValueChange} value="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    await user.click(screen.getByRole('tab', { name: 'Reports' }));

    expect(onValueChange).toHaveBeenCalledWith('reports');
  });

  it('has no accessibility violations for representative wrapper usage', async () => {
    const { container } = render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Main sections">
          <Tabs.Indicator />
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="reports">Reports</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="reports">Reports panel</Tabs.Panel>
      </Tabs>
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});

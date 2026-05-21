import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';

import type { ApiReferenceComponent } from '@/apiReference';

import { ComponentCard } from './index';

function buildComponentData(
  overrides: Partial<ApiReferenceComponent> = {}
): ApiReferenceComponent {
  return {
    apiReference: [],
    exportName: 'Menu',
    importPath: '@themeshift/ui/components/Menu',
    importString: "import { Menu } from '@themeshift/ui/components/Menu';",
    meta: {
      category: 'navigation-structure',
      description: 'Menu description',
      type: 'component',
    },
    name: 'Menu',
    routeSlug: 'menu',
    slug: 'menu',
    sourceCodeUrl:
      'https://github.com/themeshift-dev/themeshift/tree/develop/packages/ui/src/components/Menu',
    type: 'component',
    typesReference: [],
    ...overrides,
  };
}

function renderCard(componentData: ApiReferenceComponent) {
  return render(
    <MemoryRouter>
      <ComponentCard
        className="custom-card"
        componentData={componentData}
        href="/ui/component/menu"
      />
    </MemoryRouter>
  );
}

describe('ComponentCard', () => {
  it('renders component name, description, and card link', () => {
    renderCard(buildComponentData());

    expect(screen.getByText('Menu')).toBeInTheDocument();
    expect(screen.getByText('Menu description')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /Menu/i });
    expect(link).toHaveAttribute('href', '/ui/component/menu');
    expect(link).toHaveClass('custom-card');
  });

  it('does not render the headless badge when hasHeadlessVersion is not set', () => {
    renderCard(buildComponentData({ meta: null }));

    expect(
      screen.queryByLabelText('Headless version available')
    ).not.toBeInTheDocument();
  });

  it('renders headless badge and tooltip copy when a headless version exists', async () => {
    renderCard(
      buildComponentData({
        meta: {
          category: 'navigation-structure',
          description: 'Menu description',
          hasHeadlessVersion: true,
          type: 'component',
        },
      })
    );

    const badge = screen.getByLabelText('Headless version available');
    expect(badge).toBeInTheDocument();

    fireEvent.pointerEnter(badge, { pointerType: 'mouse' });
    fireEvent.mouseEnter(badge);

    expect(
      await screen.findByRole('tooltip', { name: 'Headless version available' })
    ).toBeInTheDocument();
  });
});

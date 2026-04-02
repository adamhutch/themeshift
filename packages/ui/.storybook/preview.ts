import { createElement, useEffect } from 'react';
import type { Preview } from '@storybook/react-vite';

import '../src/css/base.scss';
import '../src/css/tokens.css';
import { ThemeProvider } from '../src/contexts';
import type { ThemeMode } from '../src/contexts';

const canvasBackgroundByTheme: Record<ThemeMode, string> = {
  light: '#FFFFFF',
  dark: '#1B1C1D',
};

const panelBackgroundByTheme: Record<ThemeMode, string> = {
  light: '#FFFFFF',
  dark: '#222325',
};

const titleColorByTheme: Record<ThemeMode, string> = {
  light: '#2E3438',
  dark: '#FFFFFF',
};

function PreviewThemeFrame({
  theme,
  children,
}: {
  theme: ThemeMode;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const backgroundColor = canvasBackgroundByTheme[theme];
    const panelBackgroundColor = panelBackgroundByTheme[theme];
    const titleColor = titleColorByTheme[theme];
    const previousBodyBackground = document.body.style.backgroundColor;
    const previousHtmlBackground = document.documentElement.style.backgroundColor;
    const styleId = 'themeshift-storybook-preview-theme';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    styleElement.textContent = `
      html,
      body,
      body.sb-show-main,
      body.sb-show-main.sb-main-padded,
      body.sb-show-main.sb-main-centered,
      #storybook-root,
      #storybook-docs,
      .sbdocs,
      .sbdocs-wrapper,
      .docs-story {
        background-color: ${backgroundColor} !important;
      }

      .sbdocs,
      .sbdocs-wrapper,
      .sbdocs-content,
      .sbdocs-title,
      .sbdocs h1,
      .sbdocs h2,
      .sbdocs h3,
      .sbdocs h4,
      .sbdocs h5,
      .sbdocs h6,
      #storybook-docs h1,
      #storybook-docs h2,
      #storybook-docs h3,
      #storybook-docs h4,
      #storybook-docs h5,
      #storybook-docs h6 {
        color: ${titleColor} !important;
      }

      .sb-bar,
      .docblock-code-toggle,
      .sbdocs-preview,
      .sbdocs-preview > div:first-child,
      .docs-story > div:first-child,
      .docs-story .sb-bar,
      .docs-story .sb-anchor {
        background: ${panelBackgroundColor} !important;
      }

      .sbdocs-preview {
        border-color: ${panelBackgroundColor} !important;
        box-shadow: none !important;
      }

      .docs-story,
      .docs-story > div,
      .docs-story .innerZoomElementWrapper,
      .docs-story .innerZoomElementWrapper > div {
        background: ${backgroundColor} !important;
        border-color: transparent !important;
        box-shadow: none !important;
      }
    `;

    document.body.style.backgroundColor = backgroundColor;
    document.documentElement.style.backgroundColor = backgroundColor;

    return () => {
      document.body.style.backgroundColor = previousBodyBackground;
      document.documentElement.style.backgroundColor = previousHtmlBackground;
      styleElement?.remove();
    };
  }, [theme]);

  return createElement(
    'div',
    {
      style: {
        backgroundColor: canvasBackgroundByTheme[theme],
        minHeight: '100vh',
      },
    },
    children
  );
}

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      toolbar: {
        title: 'Theme',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [
    (Story, context) =>
      createElement(ThemeProvider, {
        defaultTheme: context.globals.theme as ThemeMode,
        storageKey: '',
        syncWithSystem: false,
        children: createElement(
          PreviewThemeFrame,
          { theme: context.globals.theme as ThemeMode },
          createElement(Story)
        ),
      }),
  ],
  parameters: {
    options: {
      storySort: {
        order: ['Foundations', 'Components'],
        method: 'alphabetical',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;

import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Typography',
  tags: ['autodocs'],
  parameters: {
    controls: { disable: true },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function tokenVar(path: string) {
  return `var(--themeshift-${path})`;
}

function typographyStyle(path: string) {
  return {
    font: tokenVar(`typography-styles-${path}-font`),
    letterSpacing: tokenVar(`typography-styles-${path}-letter-spacing`),
    fontStyle: tokenVar(`typography-styles-${path}-font-style`),
    margin: 0,
  } as const;
}

function Row({
  label,
  path,
  sample,
}: {
  label: string;
  path: string;
  sample: ReactNode;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gap: '0.75rem',
        paddingBlock: '1rem',
        borderBottom: '1px solid var(--themeshift-theme-surface-raised)',
      }}
    >
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          opacity: 0.75,
        }}
      >
        {label}
      </div>
      <div style={typographyStyle(path)}>{sample}</div>
    </div>
  );
}

export const ScalePreview: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '2rem',
        maxWidth: '72rem',
        padding: '2rem',
      }}
    >
      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            opacity: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Hero
        </div>
        <Row
          label="typography.styles.hero.default"
          path="hero-default"
          sample="Build typography that feels intentional."
        />
        <Row
          label="typography.styles.hero.default.display"
          path="hero-default-display"
          sample="Build typography that feels intentional."
        />
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            opacity: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Headings
        </div>
        <Row
          label="typography.styles.heading.h1"
          path="heading-h1"
          sample="Heading level 1"
        />
        <Row
          label="typography.styles.heading.h1.display"
          path="heading-h1-display"
          sample="Heading level 1 display"
        />
        <Row
          label="typography.styles.heading.h2"
          path="heading-h2"
          sample="Heading level 2"
        />
        <Row
          label="typography.styles.heading.h2.display"
          path="heading-h2-display"
          sample="Heading level 2 display"
        />
        <Row
          label="typography.styles.heading.h3"
          path="heading-h3"
          sample="Heading level 3"
        />
        <Row
          label="typography.styles.heading.h4"
          path="heading-h4"
          sample="Heading level 4"
        />
        <Row
          label="typography.styles.heading.h5"
          path="heading-h5"
          sample="Heading level 5"
        />
        <Row
          label="typography.styles.heading.h6"
          path="heading-h6"
          sample="Heading level 6"
        />
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            opacity: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Body
        </div>
        <Row
          label="typography.styles.body.default"
          path="body-default"
          sample="Default body copy for interface text and reading content."
        />
        <Row
          label="typography.styles.body.strong"
          path="body-strong"
          sample="Strong body copy for emphasis within paragraphs."
        />
        <Row
          label="typography.styles.body.italic"
          path="body-italic"
          sample="Italic body copy for emphasis and editorial moments."
        />
        <Row
          label="typography.styles.caption.default"
          path="caption-default"
          sample="Caption text for notes, labels, and supporting copy."
        />
        <Row
          label="typography.styles.caption.italic"
          path="caption-italic"
          sample="Italic caption text for editorial supporting notes."
        />
      </section>

      <section style={{ display: 'grid', gap: '0.5rem' }}>
        <div
          style={{
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            opacity: 0.75,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
          }}
        >
          Button
        </div>
        <Row
          label="typography.styles.button.small"
          path="button-small"
          sample="Button small"
        />
        <Row
          label="typography.styles.button.medium"
          path="button-medium"
          sample="Button medium"
        />
        <Row
          label="typography.styles.button.large"
          path="button-large"
          sample="Button large"
        />
      </section>
    </div>
  ),
};

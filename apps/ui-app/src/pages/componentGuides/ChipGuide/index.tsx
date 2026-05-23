import { Heading } from '@themeshift/ui/components/Heading';

import { useApiReference } from '@/apiReference';
import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import {
  createAccessibilityGuidelinesSection,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideIntro,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import * as examples from './examples';

const chipFallbackImport =
  "import { Chip } from '@themeshift/ui/components/Chip';";

export const ChipGuide = () => {
  const { component } = useApiReference({ component: 'chip' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? chipFallbackImport,
    intro:
      'Use Chip as a low-level primitive for compact labels, tags, and removable pills.',
    useDescription:
      'Start with shorthand props for common layouts, then switch to compound slots for full composition control.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'Chip exposes root appearance options, slot primitives, and pass-through props for custom accessibility and data attributes.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-composed"
              label="Composed"
              level={2}
            />
            <Heading level={4}>Composed primitives</Heading>
            <p>
              Use explicit slots when ordering, custom wrapping, or mixed
              content composition matters.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.composed} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-group"
              label="Group"
              level={2}
            />
            <Heading level={4}>Group layout</Heading>
            <p>
              Use <code>Chip.Group</code> as a layout-only wrapper. Selection
              and roving behavior should live in higher-level variants.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.group} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-direction"
              label="Direction (LTR/RTL)"
              level={2}
            />
            <Heading level={4}>Direction (LTR/RTL)</Heading>
            <p>
              Chip spacing and slot layout use logical properties so start/end
              patterns mirror correctly in RTL contexts.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer examples={examples.directionExamples} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-variants"
              label="Variants and sizes"
              level={2}
            />
            <Heading level={4}>Variants and sizes</Heading>
            <p>
              Tune visual emphasis and density with color, variant, and size
              presets.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.variantAndSize} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-radius"
              label="Radius"
              level={2}
            />
            <Heading level={4}>Radius variants</Heading>
            <p>
              Use the <code>radius</code> prop to adjust chip corner shape from
              square corners (<code>none</code>) to pill-like (<code>full</code>
              ) treatments.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.radius} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-truncate"
              label="Truncation"
              level={2}
            />
            <Heading level={4}>Truncation</Heading>
            <p>
              Use <code>Chip.Label truncate</code> for single-line overflow
              management in constrained layouts.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.truncate} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Explore shorthand usage, compound composition, removable chips, grouping, and direction-aware layouts.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'Chip accessibility depends on choosing correct semantics and explicit labels for action affordances.',
    items: [
      {
        title: 'Label remove actions clearly',
        content: (
          <p>
            Always provide an explicit <code>aria-label</code> for
            <code>Chip.RemoveButton</code> so the action announces clear context
            such as “Remove React”.
          </p>
        ),
        example: examples.removable,
      },
      {
        title: 'Hide decorative icons from assistive technology',
        content: (
          <p>
            Keep icons decorative by default. Set <code>decorative</code> to
            false and add an accessible label only when icon meaning is not
            already conveyed by visible text.
          </p>
        ),
        example: examples.withStartIcon,
      },
      {
        title: 'Use semantic interactive roots when needed',
        content: (
          <p>
            Use <code>interactive</code> for native button semantics, or use
            <code>asChild</code> to compose onto a semantic child element.
          </p>
        ),
        example: examples.interactiveAsChild,
      },
    ],
  });

  return (
    <ComponentGuide
      accessibility={accessibilitySection}
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/ui/component/chip',
            componentLabel: 'Chip',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for the ThemeShift Chip primitive and slots."
      eyebrow="Chip"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};

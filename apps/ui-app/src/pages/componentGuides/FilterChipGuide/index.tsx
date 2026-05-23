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

const fallbackImport =
  "import { FilterChip } from '@themeshift/ui/components/FilterChip';";

export const FilterChipGuide = () => {
  const { component } = useApiReference({ component: 'filter-chip' });

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? fallbackImport,
    intro:
      'Use FilterChip for button-based filter toggles with built-in selected state and optional group state management.',
    useDescription:
      'Start with standalone toggles, then move to FilterChip.Group when a shared single or multi-select model is needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsSection = createPropsSection({
    content: <ApiReference items={component?.apiReference ?? []} />,
    intro:
      'FilterChip exposes toggle state props, group value controls, and hidden-input form serialization helpers.',
  });

  const examplesSection = createExamplesSection({
    content: (
      <GuideExamplesGrid>
        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-controlled"
              label="Controlled"
              level={2}
            />
            <Heading level={4}>Controlled toggle</Heading>
            <p>
              Use <code>selected</code> and <code>onSelectedChange</code> for
              controlled standalone filter state.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.controlled} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-groups"
              label="Groups"
              level={2}
            />
            <Heading level={4}>Group selection models</Heading>
            <p>
              Use <code>type=&quot;multiple&quot;</code> for multi-select
              filters or <code>type=&quot;single&quot;</code> when one option
              should be active at a time.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer
              examples={[examples.multipleGroup, examples.singleGroup]}
            />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-selected-icons"
              label="Selected icons"
              level={2}
            />
            <Heading level={4}>Selected icon rendering</Heading>
            <p>
              Use <code>selectedIcon</code> for opt-in visual affordance or
              <code>hideSelectedIcon</code> when selected styling alone is
              sufficient.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.selectedIcons} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-hidden-input"
              label="Hidden input"
              level={2}
            />
            <Heading level={4}>Form serialization</Heading>
            <p>
              Use <code>FilterChip.HiddenInput</code> inside a group to submit
              selected values through native HTML forms.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.hiddenInput} />
          </GuideExampleViewer>
        </GuideExampleCard>

        <GuideExampleCard>
          <GuideExampleText>
            <TableOfContents.Marker
              id="examples-composed"
              label="Composition"
              level={2}
            />
            <Heading level={4}>Composed with Chip slots</Heading>
            <p>
              Compose <code>Chip</code> slots directly when you need explicit
              content structure.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer example={examples.composed} />
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
              FilterChip layout uses logical properties so icon and label flow
              mirror correctly in RTL contexts.
            </p>
          </GuideExampleText>
          <GuideExampleViewer>
            <ExampleViewer examples={examples.directionExamples} />
          </GuideExampleViewer>
        </GuideExampleCard>
      </GuideExamplesGrid>
    ),
    intro:
      'Explore standalone toggles, grouped behavior, selected icon affordances, and form integration.',
  });

  const accessibilitySection = createAccessibilityGuidelinesSection({
    intro:
      'FilterChip uses button semantics and aria-pressed so selected state is announced consistently.',
    items: [
      {
        title: 'Use visible text labels for clear intent',
        content: (
          <p>
            Keep readable label content inside each chip so filter meaning is
            announced directly by assistive technologies.
          </p>
        ),
        example: examples.basicUsage,
      },
      {
        title: 'Rely on aria-pressed for toggle state',
        content: (
          <p>
            FilterChip automatically manages <code>aria-pressed</code>. Avoid
            overriding it unless you are building a specialized wrapper.
          </p>
        ),
        example: examples.controlled,
      },
      {
        title: 'Prefer native button children with asChild',
        content: (
          <p>
            When using <code>asChild</code>, prefer semantic button-like
            elements so keyboard activation remains predictable.
          </p>
        ),
        example: examples.composed,
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
            componentHref: '/ui/component/filter-chip',
            componentLabel: 'FilterChip',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for the ThemeShift FilterChip variant."
      eyebrow="FilterChip"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    />
  );
};

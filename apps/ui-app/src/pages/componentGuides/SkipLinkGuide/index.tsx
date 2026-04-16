import { Heading } from '@themeshift/ui/components/Heading';

import { ApiReference, Breadcrumb, TableOfContents } from '@/app/components';
import { useComponentData } from '@/component-data';
import {
  ExampleViewer,
  GuideExampleCard,
  GuideExampleText,
  GuideIntro,
  GuideExampleViewer,
  GuideExamplesGrid,
  GuideCallout,
  createComponentBreadcrumbItems,
  createExamplesSection,
  createPropsSection,
  createQuickStartSection,
} from '@/pages/componentGuides/components';
import { ComponentGuide } from '@/templates/ComponentGuide';

import { AccessibilitySection } from './AccessibilitySection';
import * as examples from './examples';

const skipLinkFallbackImport =
  "import { SkipLink } from '@themeshift/ui/components/SkipLink';";

export const SkipLinkGuide = () => {
  const { component } = useComponentData('skiplink');

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? skipLinkFallbackImport,
    intro:
      'Place a working skip link quickly, then expand to additional landmark targets as needed.',
    useDescription:
      'Start with one skip link to your main landmark, then add additional targets only when needed.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>SkipLink</code> is a focus-revealed anchor that helps keyboard
          users bypass repeated page chrome and jump to main landmarks.
        </GuideCallout>
      }
      items={component?.apiReference ?? []}
    />
  );

  const examplesContent = (
    <GuideExamplesGrid>
      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-label"
            label="label prop"
            level={2}
          />
          <Heading level={4}>label prop</Heading>
          <p>
            Use <code>label</code> when you want concise JSX and no explicit
            child node.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.labelProp} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-anchor-props"
            label="Native props"
            level={2}
          />
          <Heading level={4}>Native anchor props</Heading>
          <p>
            Pass standard anchor attributes like <code>id</code> and{' '}
            <code>title</code> for analytics hooks or additional context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withCustomAttributes} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-multiple"
            label="Multiple links"
            level={2}
          />
          <Heading level={4}>Multiple skip links</Heading>
          <p>
            Provide multiple skip targets only when the page has repeated
            structures users frequently bypass.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.multipleTargets} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for href requirements and optional label/children behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse skip-link patterns for default labels, native anchor props, and multi-target setups.',
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/components/skip-link',
            componentLabel: 'SkipLink',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with SkipLink."
      eyebrow="SkipLink"
      examples={examplesSection}
      howToUse={quickStartSection}
      intro={intro}
      propsSection={propsSection}
      title="Docs"
      toc={<TableOfContents.Nav />}
    >
      <AccessibilitySection />
    </ComponentGuide>
  );
};

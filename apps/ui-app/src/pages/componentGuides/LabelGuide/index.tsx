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

const labelFallbackImport =
  "import { Label } from '@themeshift/ui/components/Label';";

export const LabelGuide = () => {
  const { component } = useComponentData('label');

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? labelFallbackImport,
    intro:
      'Add form labels quickly, then refine how labels map to controls and required hints.',
    useDescription:
      'Start by pairing Label with htmlFor/id, then use wrapping patterns for checkbox and switch controls.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Label</code> is a lightweight wrapper around the native
          <code>label</code> element, so native label behavior and attributes
          are available by default.
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
            id="examples-wrapping"
            label="Wrapping controls"
            level={2}
          />
          <Heading level={4}>Wrapping controls</Heading>
          <p>
            Wrap checkbox-style controls when you want the entire label area to
            toggle the control.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.wrappingControl} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-required-hint"
            label="Required hint"
            level={2}
          />
          <Heading level={4}>Required hint</Heading>
          <p>
            Keep label copy and required field semantics in sync so users do not
            miss mandatory inputs.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.requiredHint} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-multiline"
            label="Multiline"
            level={2}
          />
          <Heading level={4}>Multiline labels</Heading>
          <p>
            Longer prompt text can still be handled by <code>Label</code> when
            fields need more context.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.multiline} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for native label attributes and passthrough behavior.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse common label patterns for text inputs, checkbox controls, and long-form prompts.',
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/components/label',
            componentLabel: 'Label',
          })}
        />
      }
      description="Implementation guidance, API details, and copy-paste examples for building with Label."
      eyebrow="Label"
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

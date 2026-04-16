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

const fieldFallbackImport =
  "import { Field } from '@themeshift/ui/components/Field';";

export const FieldGuide = () => {
  const { component } = useComponentData('field');

  const intro = (
    <GuideIntro>
      <GuideExampleViewer>
        <ExampleViewer examples={examples.propHighlights} />
      </GuideExampleViewer>
    </GuideIntro>
  );

  const quickStartSection = createQuickStartSection({
    componentImport: component?.importString ?? fieldFallbackImport,
    intro:
      'Get a field wired quickly, then expand into shorthand content, composable slots, and shared control state.',
    useDescription:
      'Start with a labelled field, then layer in description, error states, and composable subcomponents when you need more control.',
    useExample: (
      <ExampleViewer defaultCodeExpanded={true} example={examples.basicUsage} />
    ),
  });

  const propsContent = (
    <ApiReference
      intro={
        <GuideCallout>
          <code>Field</code> coordinates IDs, <code>aria-describedby</code>,{' '}
          <code>aria-invalid</code>, and shared form state while controls like{' '}
          <code>Input</code> and <code>Textarea</code> stay thin wrappers around
          native elements.
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
            id="examples-shorthand"
            label="Shorthand"
            level={2}
          />
          <Heading level={4}>Shorthand content</Heading>
          <p>
            Pass <code>label</code>, <code>description</code>, and{' '}
            <code>error</code> directly to <code>Field</code> for a concise API.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.shorthandContent} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-composable"
            label="Composable"
            level={2}
          />
          <Heading level={4}>Composable API</Heading>
          <p>
            Use <code>Field.Label</code>, <code>Field.Description</code>, and{' '}
            <code>Field.Error</code> when layout and conditional rendering need
            explicit control.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.composableContent} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-required-optional"
            label="Required and optional"
            level={2}
          />
          <Heading level={4}>Required and optional</Heading>
          <p>
            Use <code>required</code> and <code>optional</code> to keep
            indicator presentation consistent with your form language.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.optionalAndRequired} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-inline-shorthand"
            label="Inline shorthand"
            level={2}
          />
          <Heading level={4}>Inline control layout (shorthand)</Heading>
          <p>
            Use <code>layout="inline-control"</code> when the control and main
            label should appear in one row, such as checkboxes.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.inlineControlShorthand} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-inline-composable"
            label="Inline composable"
            level={2}
          />
          <Heading level={4}>Inline control layout (composable)</Heading>
          <p>
            Use composable children when checkbox-style controls need custom
            wrapper structure for labels and support text.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.inlineControlComposable} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-with-textarea"
            label="With Textarea"
            level={2}
          />
          <Heading level={4}>With Textarea</Heading>
          <p>
            The same wiring applies to multiline controls, including autosize
            textareas.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.withTextarea} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-shared-state"
            label="Shared state"
            level={2}
          />
          <Heading level={4}>Shared state</Heading>
          <p>
            Set <code>disabled</code>, <code>readOnly</code>, and
            <code>validationState</code> at the field level to keep control
            behavior synchronized.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.sharedState} />
        </GuideExampleViewer>
      </GuideExampleCard>

      <GuideExampleCard>
        <GuideExampleText>
          <TableOfContents.Marker
            id="examples-hide-label"
            label="Hide label"
            level={2}
          />
          <Heading level={4}>Visually hidden label</Heading>
          <p>
            Set <code>hideLabel</code> when a visible label is not desired,
            while preserving accessible naming.
          </p>
        </GuideExampleText>

        <GuideExampleViewer>
          <ExampleViewer example={examples.hideLabel} />
        </GuideExampleViewer>
      </GuideExampleCard>
    </GuideExamplesGrid>
  );

  const propsSection = createPropsSection({
    content: propsContent,
    intro:
      'Use the API reference for Field root props and shared state primitives that integrate with field-aware controls.',
  });

  const examplesSection = createExamplesSection({
    content: examplesContent,
    intro:
      'Browse practical form composition patterns: shorthand, explicit composition, state propagation, and hidden-label layouts.',
  });

  return (
    <ComponentGuide
      breadcrumb={
        <Breadcrumb
          showHome
          items={createComponentBreadcrumbItems({
            componentHref: '/components/field',
            componentLabel: 'Field',
          })}
        />
      }
      description="A field composition primitive that owns labels, helper text, errors, and shared control semantics."
      eyebrow="Field"
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

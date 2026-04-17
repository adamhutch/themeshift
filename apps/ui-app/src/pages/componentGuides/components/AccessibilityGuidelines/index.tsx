import { Heading } from '@themeshift/ui/components/Heading';
import type { ReactNode } from 'react';

import { ExampleViewer, type ExampleViewerExample } from '../ExampleViewer';
import { createAccessibilitySection } from '../GuideSections';
import {
  GuideExampleCard,
  GuideExampleText,
  GuideExampleViewer,
  GuideExamplesGrid,
} from '../GuideExamples';
import type { ComponentGuideSection } from '@/templates/ComponentGuide';

export type AccessibilityGuideline = {
  content: ReactNode;
  example?: ExampleViewerExample;
  examples?: ExampleViewerExample[];
  title: ReactNode;
};

export type AccessibilityGuidelinesProps = {
  items: AccessibilityGuideline[];
};

export type CreateAccessibilityGuidelinesSectionOptions = {
  id?: string;
  intro?: ReactNode;
  items: AccessibilityGuideline[];
  label?: string;
  title?: ReactNode;
};

export const createAccessibilityGuidelinesSection = ({
  items,
  ...options
}: CreateAccessibilityGuidelinesSectionOptions):
  | ComponentGuideSection
  | undefined => {
  if (items.length === 0) {
    return undefined;
  }

  return createAccessibilitySection({
    content: <AccessibilityGuidelines items={items} />,
    ...options,
  });
};

export const AccessibilityGuidelines = ({
  items,
}: AccessibilityGuidelinesProps) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <GuideExamplesGrid>
      {items.map(({ content, example, examples, title }, index) => (
        <GuideExampleCard key={index}>
          <GuideExampleText>
            <Heading level={4}>{title}</Heading>
            {content}
          </GuideExampleText>

          {(example || examples) && (
            <GuideExampleViewer>
              <ExampleViewer example={example} examples={examples} />
            </GuideExampleViewer>
          )}
        </GuideExampleCard>
      ))}
    </GuideExamplesGrid>
  );
};

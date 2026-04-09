import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { ComponentCard } from './components';

const components = [
  {
    name: 'Button',
    url: '/components/button',
  },
];

export const ComponentsPage = () => (
  <PageShell>
    <Heading>Components</Heading>

    {components.map(({ name, url }) => (
      <ComponentCard name={name} key={name} url={url}></ComponentCard>
    ))}
  </PageShell>
);

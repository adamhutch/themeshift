import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import { useComponentData } from '@/component-data';
import { Link } from '@/app/components';

import styles from './ComponentsPage.module.scss';

const toComponentRoute = (componentName: string) =>
  componentName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

export const ComponentsPage = () => {
  const { components } = useComponentData();

  return (
    <PageShell>
      <Heading>Components</Heading>

      <div className={styles.components}>
        {components.map(({ component, slug }) => (
          <Link
            key={component}
            className={styles.component}
            to={`/components/${toComponentRoute(component ?? slug)}`}
          >
            {component}
          </Link>
        ))}
      </div>
    </PageShell>
  );
};

import { Heading } from '@themeshift/ui/components/Heading';
import { PageShell } from '@themeshift/ui/templates';

import styles from './ComponentGuide.module.scss';

type ComponentGuideProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
};

export const ComponentGuide = ({
  children,
  description,
  title,
}: ComponentGuideProps) => (
  <PageShell>
    {title && <Heading>{title}</Heading>}
    {description && <p>{description}</p>}

    <div className={styles.content}>{children}</div>
  </PageShell>
);

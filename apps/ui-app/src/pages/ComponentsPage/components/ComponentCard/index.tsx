import { Card } from '@themeshift/ui/components/Card';
import { Tooltip } from '@themeshift/ui/components/Tooltip';
import classNames from 'classnames';
import { MdLayers } from 'react-icons/md';

import type { ApiReferenceComponent } from '@/apiReference';
import { Link } from '@/app/components';

import styles from './ComponentCard.module.scss';

type ComponentCardProps = {
  className?: string;
  componentData: ApiReferenceComponent;
  href: string;
};

export const ComponentCard = ({
  className,
  componentData,
  href,
}: ComponentCardProps) => {
  return (
    <Card
      as={Link}
      className={classNames(styles.container, className)}
      padding="small"
      radius="small"
      shadow="none"
      to={href}
    >
      <Card.Header>
        <Card.Title>
          <span className={styles.titleRow}>
            <span>{componentData.name}</span>
            {componentData.meta?.hasHeadlessVersion ? (
              <Tooltip.Root delay={120}>
                <Tooltip.Trigger asChild>
                  <span
                    aria-label="Headless version available"
                    className={styles.headlessBadge}
                  >
                    <MdLayers size={18} aria-hidden />
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Content>Headless version available</Tooltip.Content>
              </Tooltip.Root>
            ) : null}
          </span>
        </Card.Title>
        <Card.Description>{componentData.meta?.description}</Card.Description>
      </Card.Header>
    </Card>
  );
};

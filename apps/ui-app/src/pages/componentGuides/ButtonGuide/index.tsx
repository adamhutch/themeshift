import { Button } from '@themeshift/ui/components/Button';
import { IconMoon } from '@themeshift/ui/icons/IconMoon';

import { ComponentGuide } from '@/templates/ComponentGuide';
import { CommandCopier, PreviewPane } from '@/pages/componentGuides/components';

import styles from './ButtonGuide.module.scss';
import { Heading } from '@themeshift/ui/components/Heading';
import { NavLink } from 'react-router';

const buttonSwatches = [
  {
    label: 'Basic usage',
    sample: <Button>Click me</Button>,
  },
  {
    label: 'Sizes',
    sample: (
      <>
        <Button size="small">Small</Button>
        <Button>Medium</Button>
        <Button size="large">Large</Button>
      </>
    ),
  },

  {
    label: 'Icon',
    sample: (
      <>
        <Button
          size="small"
          aria-label="Toggle theme"
          icon={<IconMoon size={12} aria-hidden />}
        />
        <Button aria-label="Toggle theme" icon={<IconMoon aria-hidden />} />
        <Button
          size="large"
          aria-label="Toggle theme"
          icon={<IconMoon size={20} aria-hidden />}
        />
      </>
    ),
  },
  {
    label: 'Busy',
    sample: (
      <>
        <Button isBusy size="small">
          Working
        </Button>
        <Button isBusy>Working</Button>
        <Button isBusy size="large">
          Working
        </Button>
      </>
    ),
  },
  {
    label: 'Intents',
    sample: (
      <>
        <Button>Primary</Button>
        <Button intent="secondary">Secondary</Button>
        <Button intent="tertiary">Tertiary</Button>
        <Button intent="constructive">Constructive</Button>
        <Button intent="destructive">Destructive</Button>
      </>
    ),
  },
  {
    label: 'Matrix',
    sample: (
      <>
        <div className={styles.buttonGroup}>
          <Button size="small">Small</Button>
          <Button>Medium</Button>
          <Button size="large">Large</Button>
        </div>
        <div className={styles.buttonGroup}>
          <Button disabled size="small">
            Small
          </Button>
          <Button disabled>Medium</Button>
          <Button disabled size="large">
            Large
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          <Button size="small" isBusy>
            Small
          </Button>
          <Button isBusy>Medium</Button>
          <Button size="large" isBusy>
            Large
          </Button>
        </div>
        <div className={styles.buttonGroup}>
          <Button disabled size="small" isBusy>
            Small
          </Button>
          <Button disabled isBusy>
            Medium
          </Button>
          <Button disabled size="large" isBusy>
            Large
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          <Button>Primary</Button>
          <Button intent="secondary">Secondary</Button>
          <Button intent="tertiary">Tertiary</Button>
          <Button intent="constructive">Constructive</Button>
          <Button intent="destructive">Destructive</Button>
        </div>
        <div className={styles.buttonGroup}>
          <Button disabled>Primary</Button>
          <Button disabled intent="secondary">
            Secondary
          </Button>
          <Button disabled intent="tertiary">
            Tertiary
          </Button>
          <Button disabled intent="constructive">
            Constructive
          </Button>
          <Button disabled intent="destructive">
            Destructive
          </Button>
        </div>

        <div className={styles.buttonGroup}>
          <Button isBusy>Primary</Button>
          <Button intent="secondary" isBusy>
            Secondary
          </Button>
          <Button intent="tertiary" isBusy>
            Tertiary
          </Button>
          <Button intent="constructive" isBusy>
            Constructive
          </Button>
          <Button intent="destructive" isBusy>
            Destructive
          </Button>
        </div>
        <div className={styles.buttonGroup}>
          <Button disabled isBusy>
            Primary
          </Button>
          <Button disabled intent="secondary" isBusy>
            Secondary
          </Button>
          <Button disabled intent="tertiary" isBusy>
            Tertiary
          </Button>
          <Button disabled intent="constructive" isBusy>
            Constructive
          </Button>
          <Button disabled intent="destructive" isBusy>
            Destructive
          </Button>
        </div>
      </>
    ),
  },
];

export const ButtonGuide = () => (
  <ComponentGuide
    title="Button"
    description="A button that's jam-packed with all the bells and whistles you could need"
  >
    <section>
      <PreviewPane swatches={buttonSwatches} />
    </section>

    <section>
      <Heading level={2}>Installation</Heading>
      <CommandCopier></CommandCopier>
    </section>

    <Button asChild>
      <NavLink to="/">Home</NavLink>
    </Button>

    <section>
      <Heading level={2}>Usage</Heading>
      <pre>{"import { Button } from '@themeshift/ui/components/Button';"}</pre>
    </section>
  </ComponentGuide>
);

import { Badge } from '@themeshift/ui/components/Badge';
import { Button } from '@themeshift/ui/components/Button';
import { Heading } from '@themeshift/ui/components/Heading';
import { type ElementType, type ReactNode } from 'react';
import {
  FaBookOpen,
  FaCode,
  FaGithub,
  FaPalette,
  FaRegCheckCircle,
  FaStar,
  FaTree,
} from 'react-icons/fa';
import { IoAccessibility } from 'react-icons/io5';
import { NavLink } from 'react-router';

import { useApiReference } from '@/apiReference';

import styles from './Landing.module.scss';
import { COMPONENT_PREVIEWS } from './examples/componentPreviews';

const PRIMARY_DOCS_ROUTE = '/ui';
const TOKENS_ROUTE = '/design-tokens';

const GITHUB_REPO_URL = 'https://github.com/themeshift-dev/themeshift';
const GITHUB_CONTRIBUTING_URL =
  'https://github.com/themeshift-dev/themeshift/pulls';
const GITHUB_ISSUES_URL = 'https://github.com/themeshift-dev/themeshift/issues';

type FeatureCard = {
  body: string;
  icon: ReactNode;
  title: string;
};

const FEATURE_CARDS: FeatureCard[] = [
  {
    body: 'Typed component and hook APIs designed for TypeScript-first React apps.',
    icon: <FaCode aria-hidden />,
    title: 'Type-Safe',
  },
  {
    body: 'Import only what you need with per-component and per-hook entrypoints.',
    icon: <FaTree aria-hidden />,
    title: 'Tree-Shakable',
  },
  {
    body: 'Build your own look with design tokens and theme-aware CSS variables.',
    icon: <FaPalette aria-hidden />,
    title: 'Token-Driven Customization',
  },
  {
    body: 'Component guides include examples, API tables, and accessibility guidance.',
    icon: <FaBookOpen aria-hidden />,
    title: 'Well Documented',
  },
  {
    body: 'Open source under MIT with contribution-friendly workflows in public.',
    icon: <FaGithub aria-hidden />,
    title: 'Open Source',
  },
  {
    body: 'Representative accessibility tests and focus patterns are built into the repo.',
    icon: <IoAccessibility aria-hidden />,
    title: 'Accessibility-Minded',
  },
];

type OssAction = {
  href: string;
  icon: ElementType;
  label: string;
};

const OSS_ACTIONS: OssAction[] = [
  {
    href: `${GITHUB_REPO_URL}/stargazers`,
    icon: FaStar,
    label: 'Give us a star',
  },
  {
    href: GITHUB_CONTRIBUTING_URL,
    icon: FaCode,
    label: 'Contribute',
  },
  {
    href: GITHUB_ISSUES_URL,
    icon: FaRegCheckCircle,
    label: 'Open an issue',
  },
];

export const Landing = () => {
  const { components, hooks } = useApiReference();

  return (
    <main aria-label="ThemeShift UI home" className={styles.main}>
      <section aria-labelledby="landing-hero-title" className={styles.hero}>
        <p className={styles.eyebrow}>ThemeShift UI</p>
        <Heading className={styles.heroTitle} level={1}>
          Build React interfaces faster with thoughtful defaults.
        </Heading>
        <p className={styles.heroLead}>
          We&apos;ve got the pieces you need to start building your app: typed
          components, clear docs, and design-token customization you can
          actually grow with.
        </p>

        <div className={styles.heroActions}>
          <Button asChild intent="tertiary">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Explore the docs</NavLink>
          </Button>

          <Button asChild intent="tertiary">
            <a href={GITHUB_REPO_URL} rel="noreferrer" target="_blank">
              View on GitHub
            </a>
          </Button>
        </div>

        <div className={styles.heroMetaBadges}>
          <Badge tone="info" variant="outline">
            {components.length} components
          </Badge>
          <Badge tone="info" variant="outline">
            {hooks.length} hooks
          </Badge>
          <Badge tone="success" variant="soft">
            MIT licensed
          </Badge>
        </div>
      </section>

      <section
        aria-labelledby="landing-features-title"
        className={styles.section}
      >
        <Heading id="landing-features-title" level={2}>
          Features
        </Heading>

        <div className={styles.featureGrid}>
          {FEATURE_CARDS.map((feature) => (
            <article className={styles.featureCard} key={feature.title}>
              <div className={styles.featureIcon} aria-hidden>
                {feature.icon}
              </div>
              <Heading className={styles.cardTitle} level={3}>
                {feature.title}
              </Heading>
              <p>{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="landing-components-title"
        className={styles.section}
      >
        <Heading id="landing-components-title" level={2}>
          Components
        </Heading>

        <div className={styles.componentGrid}>
          {COMPONENT_PREVIEWS.map((item, index) => (
            <article
              aria-label={item.label}
              className={styles.componentPreviewCard}
              key={item.label}
            >
              <span className={styles.srOnly}>{item.label}</span>
              <div className={styles.previewBody}>{item.preview}</div>
              <div className={styles.previewGlow} aria-hidden />
              <span className={styles.previewIndex} aria-hidden>
                {String(index + 1).padStart(2, '0')}
              </span>
            </article>
          ))}
        </div>

        <div className={styles.previewFooter}>
          <Button asChild intent="tertiary">
            <NavLink to={PRIMARY_DOCS_ROUTE}>Browse all component docs</NavLink>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="landing-tokens-title"
        className={`${styles.section} ${styles.centerSection} ${styles.withDivider}`}
      >
        <Heading id="landing-tokens-title" level={2}>
          Customize through design tokens
        </Heading>
        <p className={styles.centerLead}>
          Keep the same components and shape them to your product with
          token-based typography, spacing, and color.
        </p>

        <div className={styles.actionsRow}>
          <Button asChild intent="tertiary">
            <NavLink to={TOKENS_ROUTE}>Explore design token docs</NavLink>
          </Button>
        </div>
      </section>

      <section
        aria-labelledby="landing-pricing-title"
        className={`${styles.section} ${styles.centerSection} ${styles.withDivider}`}
      >
        <Heading id="landing-pricing-title" level={2}>
          Pricing
        </Heading>
        <p className={styles.centerLead}>
          Just kidding. ThemeShift UI is free and open source. If it helps your
          team, there are a few great ways to support it.
        </p>

        <div className={styles.actionsRow}>
          {OSS_ACTIONS.map(({ label, icon: Icon, href }) => (
            <Button
              asChild
              intent="tertiary"
              key={label}
              startIcon={<Icon aria-hidden />}
            >
              <a href={href} rel="noreferrer" target="_blank">
                <span>{label}</span>
              </a>
            </Button>
          ))}
        </div>
      </section>

      <section aria-labelledby="landing-cta-title" className={styles.finalCta}>
        <Heading id="landing-cta-title" level={2}>
          Ready to get started?
        </Heading>
        <p>Explore the docs and start building your app today.</p>

        <Button asChild size="large">
          <NavLink to={PRIMARY_DOCS_ROUTE}>Explore the docs</NavLink>
        </Button>
      </section>
    </main>
  );
};

import React from 'react';
import classNames from 'classnames';

import styles from './Heading.module.scss';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingProps = {
  level?: HeadingLevel;
  muted?: boolean;
} & React.ComponentPropsWithoutRef<'h1'>;

const levelElementMap = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const levelClassMap = {
  1: styles.h1,
  2: styles.h2,
  3: styles.h3,
  4: styles.h4,
  5: styles.h5,
  6: styles.h6,
} satisfies Record<HeadingLevel, string>;

export const Heading = ({
  children,
  className,
  level = 1,
  muted = false,
  ...headingProps
}: HeadingProps) => {
  return React.createElement(
    levelElementMap[level],
    {
      ...headingProps,
      className: classNames(
        className,
        styles.heading,
        muted && styles.muted,
        levelClassMap[level]
      ),
    },
    children
  );
};

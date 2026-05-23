/* eslint-disable react-refresh/only-export-components */
import classNames from 'classnames';
import {
  Children,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

import {
  FilterChipGroup as HeadlessFilterChipGroup,
  FilterChipHiddenInput as HeadlessFilterChipHiddenInput,
  FilterChipRoot as HeadlessFilterChipRoot,
} from '@themeshift/headless/components/FilterChip';

import { Chip } from '@/components/Chip';
import { IconCheck } from '@/icons';

import styles from './FilterChip.module.scss';
import type {
  FilterChipColor,
  FilterChipCompoundComponent,
  FilterChipGroupGap,
  FilterChipGroupOrientation,
  FilterChipGroupProps,
  FilterChipHiddenInputProps,
  FilterChipProps,
  FilterChipSize,
  FilterChipVariant,
} from './types';

const CHIP_SLOT_SYMBOL = Symbol.for('themeshift.chip.slot');

type ChipSlot = 'avatar' | 'icon' | 'label' | 'remove-button';

type ChipSlotMarker = {
  [CHIP_SLOT_SYMBOL]?: ChipSlot;
};

function hasRenderableContent(content: ReactNode) {
  return content !== null && content !== undefined;
}

function getChipSlotName(node: ReactNode): ChipSlot | null {
  if (!isValidElement(node)) {
    return null;
  }

  return ((node.type as ChipSlotMarker)[CHIP_SLOT_SYMBOL] ??
    null) as ChipSlot | null;
}

function getSelectedIconNode(selectedIcon: FilterChipProps['selectedIcon']) {
  if (selectedIcon === true) {
    return <IconCheck aria-hidden="true" size={14} />;
  }

  if (!selectedIcon) {
    return null;
  }

  return selectedIcon;
}

function warnIfAsChildShorthandUsed(
  asChild: boolean,
  children: ReactNode,
  props: Pick<
    FilterChipProps,
    'avatar' | 'endIcon' | 'selectedIcon' | 'startIcon'
  >
) {
  if (!asChild || import.meta.env.MODE === 'production') {
    return;
  }

  if (!isValidElement(children) || Children.count(children) !== 1) {
    return;
  }

  const childType = children.type;

  if (typeof childType === 'string' && childType !== 'button') {
    console.warn(
      'ThemeShift FilterChip with asChild should use a semantic button child when possible. Non-button children must provide equivalent keyboard and interaction semantics.'
    );
  }

  if (
    hasRenderableContent(props.avatar) ||
    hasRenderableContent(props.startIcon) ||
    hasRenderableContent(props.endIcon) ||
    props.selectedIcon
  ) {
    console.warn(
      'ThemeShift FilterChip ignores avatar/icon shorthand props when asChild is true. Compose those visuals inside the child element directly.'
    );
  }
}

/**
 * Theme-aware filter chip built on top of the headless toggle primitive and `Chip` layout composition.
 */
export const FilterChipRoot = forwardRef<HTMLElement, FilterChipProps>(
  (
    {
      asChild = false,
      avatar,
      children,
      className,
      color = 'neutral',
      defaultSelected = false,
      disabled,
      endIcon,
      hideSelectedIcon = false,
      onSelectedChange,
      reserveSelectedIconSpace = true,
      selected,
      selectedIcon,
      size = 'medium',
      startIcon,
      value,
      variant = 'subtle',
      ...rootProps
    },
    ref
  ) => {
    warnIfAsChildShorthandUsed(asChild, children, {
      avatar,
      endIcon,
      selectedIcon,
      startIcon,
    });

    const childItems = Children.toArray(children);
    const hasAvatarSlot = childItems.some(
      (item) => getChipSlotName(item) === 'avatar'
    );
    const hasLabelSlot = childItems.some(
      (item) => getChipSlotName(item) === 'label'
    );
    const hasStartIconSlot = childItems.some((item) => {
      if (!isValidElement(item) || getChipSlotName(item) !== 'icon') {
        return false;
      }

      return (
        (item as ReactElement<{ position?: 'start' | 'end' }>).props
          .position !== 'end'
      );
    });
    const hasEndIconSlot = childItems.some((item) => {
      if (!isValidElement(item) || getChipSlotName(item) !== 'icon') {
        return false;
      }

      return (
        (item as ReactElement<{ position?: 'start' | 'end' }>).props
          .position === 'end'
      );
    });
    const hasSlotChildren =
      hasAvatarSlot || hasEndIconSlot || hasLabelSlot || hasStartIconSlot;

    const selectedIconNode = hideSelectedIcon
      ? null
      : getSelectedIconNode(selectedIcon);

    const selectedIconSlot = selectedIconNode ? (
      <Chip.Icon
        aria-hidden="true"
        className={styles.selectedIcon}
        decorative={true}
        position="start"
      >
        {selectedIconNode}
      </Chip.Icon>
    ) : null;
    const selectedIconPlaceholderSlot =
      selectedIconNode && reserveSelectedIconSpace ? (
        <Chip.Icon
          aria-hidden="true"
          className={styles.selectedIconPlaceholder}
          decorative={true}
          position="start"
        >
          {selectedIconNode}
        </Chip.Icon>
      ) : null;

    let content = children;

    if (!asChild) {
      if (hasSlotChildren) {
        content = (
          <>
            {selectedIconSlot}
            {selectedIconPlaceholderSlot}

            {!hasAvatarSlot && hasRenderableContent(avatar) ? (
              <Chip.Avatar>{avatar}</Chip.Avatar>
            ) : null}

            {!hasStartIconSlot && hasRenderableContent(startIcon) ? (
              <Chip.Icon position="start">{startIcon}</Chip.Icon>
            ) : null}

            {children}

            {!hasEndIconSlot && hasRenderableContent(endIcon) ? (
              <Chip.Icon position="end">{endIcon}</Chip.Icon>
            ) : null}
          </>
        );
      } else {
        content = (
          <>
            {selectedIconSlot}
            {selectedIconPlaceholderSlot}

            {hasRenderableContent(avatar) ? (
              <Chip.Avatar>{avatar}</Chip.Avatar>
            ) : null}

            {hasRenderableContent(startIcon) ? (
              <Chip.Icon position="start">{startIcon}</Chip.Icon>
            ) : null}

            {hasRenderableContent(children) ? (
              <Chip.Label>{children}</Chip.Label>
            ) : null}

            {hasRenderableContent(endIcon) ? (
              <Chip.Icon position="end">{endIcon}</Chip.Icon>
            ) : null}
          </>
        );
      }
    }

    return (
      <HeadlessFilterChipRoot
        {...rootProps}
        asChild={true}
        color={color as FilterChipColor}
        defaultSelected={defaultSelected}
        disabled={disabled}
        onSelectedChange={onSelectedChange}
        ref={ref}
        selected={selected}
        size={size as FilterChipSize}
        value={value}
        variant={variant as FilterChipVariant}
      >
        <Chip
          asChild={asChild}
          className={classNames(styles.root, className)}
          color={color}
          disabled={disabled}
          interactive
          size={size}
          variant={variant}
        >
          {content}
        </Chip>
      </HeadlessFilterChipRoot>
    );
  }
);

FilterChipRoot.displayName = 'FilterChip';

/**
 * Theme-aware grouped filter chip primitive with built-in selection state behavior.
 */
export const FilterChipGroup = forwardRef<HTMLDivElement, FilterChipGroupProps>(
  (
    {
      children,
      className,
      defaultValue,
      disabled,
      gap = 'small',
      onValueChange,
      orientation = 'horizontal',
      type = 'multiple',
      value,
      wrap = true,
      ...groupProps
    },
    ref
  ) => (
    <HeadlessFilterChipGroup
      {...groupProps}
      defaultValue={defaultValue}
      disabled={disabled}
      gap={gap}
      onValueChange={onValueChange}
      orientation={orientation}
      ref={ref}
      type={type}
      value={value}
      wrap={wrap}
    >
      <Chip.Group
        className={classNames(styles.group, className)}
        gap={gap as FilterChipGroupGap}
        orientation={orientation as FilterChipGroupOrientation}
        wrap={wrap}
      >
        {children}
      </Chip.Group>
    </HeadlessFilterChipGroup>
  )
);

FilterChipGroup.displayName = 'FilterChip.Group';

/**
 * Hidden input serializer for integrating `FilterChip.Group` with native form submission.
 */
export const FilterChipHiddenInput = forwardRef<
  HTMLInputElement,
  FilterChipHiddenInputProps
>((props, ref) => <HeadlessFilterChipHiddenInput {...props} ref={ref} />);

FilterChipHiddenInput.displayName = 'FilterChip.HiddenInput';

export const FilterChip = Object.assign(FilterChipRoot, {
  Group: FilterChipGroup,
  HiddenInput: FilterChipHiddenInput,
}) as FilterChipCompoundComponent;

export type {
  FilterChipColor,
  FilterChipGroupGap,
  FilterChipGroupOrientation,
  FilterChipGroupProps,
  FilterChipGroupType,
  FilterChipGroupValue,
  FilterChipHiddenInputProps,
  FilterChipProps,
  FilterChipRootProps,
  FilterChipSize,
  FilterChipVariant,
} from './types';

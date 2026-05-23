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
  ChipAvatar as HeadlessChipAvatar,
  ChipGroup as HeadlessChipGroup,
  ChipIcon as HeadlessChipIcon,
  ChipLabel as HeadlessChipLabel,
  ChipRemoveButton as HeadlessChipRemoveButton,
  ChipRoot as HeadlessChipRoot,
} from '@themeshift/headless/components/Chip';

import { IconClose } from '@/icons';

import styles from './Chip.module.scss';
import type {
  ChipAvatarProps,
  ChipColor,
  ChipCompoundComponent,
  ChipGroupGap,
  ChipGroupOrientation,
  ChipGroupProps,
  ChipIconProps,
  ChipLabelProps,
  ChipProps,
  ChipRadius,
  ChipRemoveButtonProps,
  ChipSize,
  ChipVariant,
} from './types';

const CHIP_SLOT_SYMBOL = Symbol.for('themeshift.chip.slot');

type ChipSlot = 'avatar' | 'icon' | 'label' | 'remove-button';

type ChipSlotMarker = {
  [CHIP_SLOT_SYMBOL]?: ChipSlot;
};

const colorClassMap = {
  neutral: styles.colorNeutral,
  accent: styles.colorAccent,
  success: styles.colorSuccess,
  warning: styles.colorWarning,
  danger: styles.colorDanger,
} satisfies Record<ChipColor, string>;

const gapClassMap = {
  xSmall: styles.groupGapXSmall,
  small: styles.groupGapSmall,
  medium: styles.groupGapMedium,
} satisfies Record<ChipGroupGap, string>;

const orientationClassMap = {
  horizontal: styles.groupHorizontal,
  vertical: styles.groupVertical,
} satisfies Record<ChipGroupOrientation, string>;

const radiusClassMap = {
  none: styles.radiusNone,
  full: styles.radiusFull,
  large: styles.radiusLarge,
  medium: styles.radiusMedium,
} satisfies Record<ChipRadius, string>;

const sizeClassMap = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
} satisfies Record<ChipSize, string>;

const variantClassMap = {
  subtle: styles.variantSubtle,
  outline: styles.variantOutline,
  solid: styles.variantSolid,
} satisfies Record<ChipVariant, string>;

const markChipSlot = <T extends object>(component: T, slot: ChipSlot): T => {
  (component as ChipSlotMarker)[CHIP_SLOT_SYMBOL] = slot;

  return component;
};

function getChipSlotName(node: ReactNode): ChipSlot | null {
  if (!isValidElement(node)) {
    return null;
  }

  return ((node.type as ChipSlotMarker)[CHIP_SLOT_SYMBOL] ??
    null) as ChipSlot | null;
}

function hasRenderableContent(content: ReactNode) {
  return content !== null && content !== undefined;
}

/**
 * Label slot for Chip text content.
 */
export const ChipLabel = markChipSlot(
  forwardRef<HTMLSpanElement, ChipLabelProps>(
    ({ className, truncate = false, ...labelProps }, ref) => (
      <HeadlessChipLabel
        {...labelProps}
        className={classNames(
          styles.label,
          truncate && styles.truncate,
          className
        )}
        ref={ref}
        truncate={truncate}
      />
    )
  ),
  'label'
);

/**
 * Icon slot for start and end adornments.
 */
export const ChipIcon = markChipSlot(
  forwardRef<HTMLSpanElement, ChipIconProps>(
    (
      { className, decorative = true, position = 'start', ...iconProps },
      ref
    ) => (
      <HeadlessChipIcon
        {...iconProps}
        className={classNames(
          styles.icon,
          position === 'start' ? styles.iconStart : styles.iconEnd,
          className
        )}
        decorative={decorative}
        position={position}
        ref={ref}
      />
    )
  ),
  'icon'
);

/**
 * Avatar slot for identity visuals inside a chip.
 */
export const ChipAvatar = markChipSlot(
  forwardRef<HTMLSpanElement, ChipAvatarProps>(
    ({ className, ...avatarProps }, ref) => (
      <HeadlessChipAvatar
        {...avatarProps}
        className={classNames(styles.avatar, className)}
        ref={ref}
      />
    )
  ),
  'avatar'
);

/**
 * Remove-action button slot for dismissible chip patterns.
 */
export const ChipRemoveButton = markChipSlot(
  forwardRef<HTMLButtonElement, ChipRemoveButtonProps>(
    ({ children, className, ...removeButtonProps }, ref) => (
      <HeadlessChipRemoveButton
        {...removeButtonProps}
        className={classNames(styles.removeButton, className)}
        ref={ref}
      >
        {children ?? <IconClose aria-hidden="true" size={14} />}
      </HeadlessChipRemoveButton>
    )
  ),
  'remove-button'
);

/**
 * Layout-only chip group primitive.
 */
export const ChipGroup = forwardRef<HTMLDivElement, ChipGroupProps>(
  (
    {
      className,
      gap = 'small',
      orientation = 'horizontal',
      wrap = true,
      ...groupProps
    },
    ref
  ) => (
    <HeadlessChipGroup
      {...groupProps}
      className={classNames(
        styles.group,
        gapClassMap[gap],
        orientationClassMap[orientation],
        wrap && styles.groupWrap,
        className
      )}
      gap={gap}
      orientation={orientation}
      ref={ref}
      wrap={wrap}
    />
  )
);

/**
 * Theme-aware chip root primitive with shorthand and compound composition.
 */
export const ChipRoot = forwardRef<HTMLElement, ChipProps>(
  (
    {
      avatar,
      children,
      className,
      color = 'neutral',
      disabled = false,
      endIcon,
      interactive = false,
      onRemove,
      radius = 'full',
      removable = false,
      removeLabel = 'Remove',
      size = 'medium',
      startIcon,
      variant = 'subtle',
      asChild = false,
      ...rootProps
    },
    ref
  ) => {
    const childItems = Children.toArray(children);
    const hasAvatarSlot = childItems.some(
      (item) => getChipSlotName(item) === 'avatar'
    );
    const hasLabelSlot = childItems.some(
      (item) => getChipSlotName(item) === 'label'
    );
    const hasRemoveButtonSlot = childItems.some(
      (item) => getChipSlotName(item) === 'remove-button'
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
      hasAvatarSlot ||
      hasLabelSlot ||
      hasRemoveButtonSlot ||
      hasStartIconSlot ||
      hasEndIconSlot;

    let content = children;

    if (!asChild) {
      if (hasSlotChildren) {
        content = (
          <>
            {!hasAvatarSlot && hasRenderableContent(avatar) ? (
              <ChipAvatar>{avatar}</ChipAvatar>
            ) : null}

            {!hasStartIconSlot && hasRenderableContent(startIcon) ? (
              <ChipIcon position="start">{startIcon}</ChipIcon>
            ) : null}

            {children}

            {!hasEndIconSlot && hasRenderableContent(endIcon) ? (
              <ChipIcon position="end">{endIcon}</ChipIcon>
            ) : null}

            {!hasRemoveButtonSlot && removable ? (
              <ChipRemoveButton aria-label={removeLabel} onClick={onRemove} />
            ) : null}
          </>
        );
      } else {
        content = (
          <>
            {hasRenderableContent(avatar) ? (
              <ChipAvatar>{avatar}</ChipAvatar>
            ) : null}
            {hasRenderableContent(startIcon) ? (
              <ChipIcon position="start">{startIcon}</ChipIcon>
            ) : null}
            {hasRenderableContent(children) ? (
              <ChipLabel>{children}</ChipLabel>
            ) : null}
            {hasRenderableContent(endIcon) ? (
              <ChipIcon position="end">{endIcon}</ChipIcon>
            ) : null}
            {removable ? (
              <ChipRemoveButton aria-label={removeLabel} onClick={onRemove} />
            ) : null}
          </>
        );
      }
    }

    return (
      <HeadlessChipRoot
        {...rootProps}
        asChild={asChild}
        className={classNames(
          styles.root,
          colorClassMap[color],
          sizeClassMap[size],
          variantClassMap[variant],
          radiusClassMap[radius],
          interactive && styles.interactive,
          disabled && styles.disabled,
          className
        )}
        color={color}
        disabled={disabled}
        interactive={interactive}
        radius={radius}
        ref={ref}
        size={size}
        variant={variant}
      >
        {content}
      </HeadlessChipRoot>
    );
  }
);

ChipLabel.displayName = 'Chip.Label';
ChipIcon.displayName = 'Chip.Icon';
ChipAvatar.displayName = 'Chip.Avatar';
ChipRemoveButton.displayName = 'Chip.RemoveButton';
ChipGroup.displayName = 'Chip.Group';

export const Chip = Object.assign(ChipRoot, {
  Avatar: ChipAvatar,
  Group: ChipGroup,
  Icon: ChipIcon,
  Label: ChipLabel,
  RemoveButton: ChipRemoveButton,
}) as ChipCompoundComponent;

ChipRoot.displayName = 'Chip';

export type {
  ChipAvatarProps,
  ChipColor,
  ChipGroupGap,
  ChipGroupOrientation,
  ChipGroupProps,
  ChipIconProps,
  ChipLabelProps,
  ChipProps,
  ChipRadius,
  ChipRemoveButtonProps,
  ChipRootProps,
  ChipSize,
  ChipVariant,
} from './types';

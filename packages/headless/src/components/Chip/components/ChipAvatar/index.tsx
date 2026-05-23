import { forwardRef } from 'react';

import type { ChipAvatarProps } from '@/components/Chip/types';

function getInitials(name?: string) {
  if (!name) {
    return '';
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '';
  }

  if (parts.length === 1) {
    return parts[0]?.charAt(0).toUpperCase() ?? '';
  }

  return `${parts[0]?.charAt(0) ?? ''}${parts[parts.length - 1]?.charAt(0) ?? ''}`.toUpperCase();
}

/**
 * Headless avatar slot for Chip composition.
 */
export const ChipAvatar = forwardRef<HTMLSpanElement, ChipAvatarProps>(
  ({ alt, children, fallback, name, src, ...avatarProps }, ref) => {
    const initials = getInitials(name);

    let content = children;

    if (content === undefined || content === null) {
      if (src) {
        content = <img alt={alt ?? name ?? ''} src={src} />;
      } else if (fallback !== undefined) {
        content = fallback;
      } else if (initials) {
        content = <span>{initials}</span>;
      }
    }

    return (
      <span {...avatarProps} data-has-image={src ? '' : undefined} ref={ref}>
        {content}
      </span>
    );
  }
);

ChipAvatar.displayName = 'Chip.Avatar';

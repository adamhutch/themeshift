import type { MutableRefObject, Ref, RefObject } from 'react';

export function callEventHandler<EventType>(
  handler: ((event: EventType) => void) | undefined,
  event: EventType
) {
  handler?.(event);
}

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    refs.forEach((ref) => {
      if (!ref) {
        return;
      }

      if (typeof ref === 'function') {
        ref(node);
        return;
      }

      (ref as MutableRefObject<T | null>).current = node;
    });
  };
}

export function setRefValue<T>(ref: RefObject<T | null>, node: T | null) {
  (ref as MutableRefObject<T | null>).current = node;
}

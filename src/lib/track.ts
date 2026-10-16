type EventData = Record<string, string>;

declare global {
  interface Window {
    umami?: { track: (name: string, data?: EventData) => void };
  }
}

/**
 * Fire an Umami event from a component's own handler. Use this instead of
 * data-umami-event on any element that has its own onClick: per the Umami
 * docs, the data-attribute path suppresses other listeners on the element.
 * No-ops when the tracker is blocked or absent (dev, ad blockers).
 */
export function track(name: string, data?: EventData) {
  window.umami?.track(name, data);
}

import { useEffect, useRef } from 'react';

const FOCUSABLE = 'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Traps focus inside a container while it's mounted, sends focus to the first
 * focusable element on mount, and restores focus to whatever was focused before
 * mount when unmounted. Also handles Escape to call `onEscape`.
 *
 * Usage:
 *   const ref = useFocusTrap(onClose);
 *   <div ref={ref} role="dialog" aria-modal="true">...</div>
 */
export function useFocusTrap(onEscape) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const lastFocused = document.activeElement;

    const focusables = node.querySelectorAll(FOCUSABLE);
    const first = focusables[0];
    if (first) first.focus();
    else node.focus();

    const onKey = (e) => {
      if (e.key === 'Escape' && onEscape) {
        e.stopPropagation();
        onEscape();
        return;
      }
      if (e.key !== 'Tab') return;
      const list = node.querySelectorAll(FOCUSABLE);
      if (list.length === 0) { e.preventDefault(); return; }
      const firstEl = list[0];
      const lastEl = list[list.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    };
  }, [onEscape]);

  return ref;
}

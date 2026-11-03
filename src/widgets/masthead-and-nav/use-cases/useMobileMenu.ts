import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { navItems, type NavKey } from '@/shared/config';

const FOCUSABLE = 'a[href], button:not([disabled])';

export function useMobileMenu(current: NavKey): {
  viewModel: { open: boolean; ready: boolean; links: { key: NavKey; label: string; href: string; current: boolean }[] };
  buttonRef: RefObject<HTMLButtonElement | null>;
  dialogRef: RefObject<HTMLDivElement | null>;
  openMenu: () => void;
  closeMenu: () => void;
  onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => void;
} {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const wasOpen = useRef(false);

  useEffect(() => setReady(true), []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      dialogRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus();
    } else {
      document.body.style.overflow = '';
      if (wasOpen.current) buttonRef.current?.focus();
    }
    wasOpen.current = open;
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return {
    viewModel: { open, ready, links: navItems.map((item) => ({ ...item, current: item.key === current })) },
    buttonRef,
    dialogRef,
    openMenu: () => setOpen(true),
    closeMenu: () => setOpen(false),
    onKeyDown,
  };
}

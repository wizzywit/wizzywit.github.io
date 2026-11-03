import { ThemeToggle } from '@/features/theme-switch';
import type { NavKey } from '@/shared/config';
import { useMobileMenu } from '../use-cases/useMobileMenu';
import './MobileMenu.css';

export function MobileMenu({ current }: { current?: NavKey | undefined }) {
  const { viewModel, buttonRef, dialogRef, openMenu, closeMenu, onKeyDown } = useMobileMenu(current);
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="menu-btn"
        aria-label="Open menu"
        aria-expanded={viewModel.open}
        aria-haspopup="dialog"
        data-ready={viewModel.ready}
        hidden={!viewModel.ready}
        onClick={openMenu}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
        Menu
      </button>
      {viewModel.open && (
        <div ref={dialogRef} className="menu-overlay" role="dialog" aria-modal="true" aria-label="Site menu" onKeyDown={onKeyDown}>
          <div className="menu-top">
            <span className="menu-brand">W. E. Praise</span>
            <button type="button" className="menu-close" aria-label="Close menu" onClick={closeMenu}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
              Close
            </button>
          </div>
          <nav aria-label="Sections" className="menu-nav">
            {viewModel.links.map((link, index) => (
              <a key={link.key} href={link.href} aria-current={link.current ? 'page' : undefined} style={{ animationDelay: `${index * 50}ms` }}>
                {link.label}
              </a>
            ))}
          </nav>
          <div className="menu-foot">
            <ThemeToggle />
            <a className="menu-write" href="/contact/">Write to me</a>
          </div>
        </div>
      )}
    </>
  );
}

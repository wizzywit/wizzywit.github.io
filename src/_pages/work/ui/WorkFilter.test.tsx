// @vitest-environment jsdom
import { cleanup, render, renderHook, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import type { Project } from '@/entities/project';
import { useWorkIndex } from '../use-cases/useWorkIndex';
import { WorkFilter } from './WorkFilter';

const make = (slug: string, section: Project['section'], href: string | null = null): Project => ({
  slug, title: `Title ${slug}`, section, kicker: `${section} · test`, summary: `Summary ${slug}`, role: `Role ${slug}`,
  href, external: href?.startsWith('http') ?? false, hasCaseStudy: false, order: 1, draft: false, image: null, links: [],
});
const projects = [
  make('a', 'Platform', '/decisions/five-layers/'),
  make('b', 'Security'),
  make('c', 'Platform'),
  make('d', 'Security', 'https://example.com/d'),
];

afterEach(cleanup);

describe('WorkFilter', () => {
  it('lists every entry numbered, with a count', () => {
    render(<WorkFilter projects={projects} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByText('01')).toBeTruthy();
    expect(screen.getByText('4 entries')).toBeTruthy();
  });

  it('offers only sections that have entries', () => {
    render(<WorkFilter projects={projects} />);
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['All', 'Platform', 'Security']);
  });

  it('filters to a section and announces the count politely', async () => {
    render(<WorkFilter projects={projects} />);
    await userEvent.click(screen.getByRole('button', { name: 'Security' }));
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Security' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByText('2 entries in Security').getAttribute('aria-live')).toBe('polite');
  });

  it('links only entries that have a destination', () => {
    render(<WorkFilter projects={projects} />);
    expect(screen.getByRole('link', { name: 'Title a' }).getAttribute('href')).toBe('/decisions/five-layers/');
    expect(screen.queryByRole('link', { name: 'Title b' })).toBeNull();
    expect(screen.getByRole('link', { name: 'Title d' }).getAttribute('rel')).toBe('noopener');
  });
});

describe('WorkFilter link affordance', () => {
  it('tells the visitor where each linked entry goes, in words', () => {
    render(<WorkFilter projects={projects} />);
    expect(screen.getByText('Read the decision →')).toBeTruthy();
    expect(screen.getByText('Visit the site ↗')).toBeTruthy();
    expect(screen.getAllByText(/[→↗]$/)).toHaveLength(2);
  });

  it('shows no call to action for an entry without a destination', () => {
    render(<WorkFilter projects={[make('b', 'Security')]} />);
    expect(screen.queryByText(/Read|Visit|View/)).toBeNull();
  });

  it('keeps the title link as the single link to the destination', () => {
    render(<WorkFilter projects={projects} />);
    expect(screen.getAllByRole('link', { name: /Title a/ })).toHaveLength(1);
  });

  it('lists further links, such as the source, as links of their own', () => {
    const odudu = { ...make('c', 'Identity', '/work/odudu/'), hasCaseStudy: true, links: [{ label: 'Source', href: 'https://github.com/wizzywit/odudu' }] };
    render(<WorkFilter projects={[odudu]} />);
    expect(screen.getByRole('link', { name: /Source/ }).getAttribute('href')).toBe('https://github.com/wizzywit/odudu');
    expect(screen.getByText('Read the case study →')).toBeTruthy();
  });
});

describe('WorkFilter thumbnails', () => {
  const withPicture = [{ ...make('a', 'Platform'), image: { name: 'a.png', alt: 'A picture of a' } }, make('b', 'Platform')];
  const thumbs = { a: { src: '/_astro/a.webp', width: 360, height: 225 } };

  it('shows a described thumbnail for entries that have one', () => {
    render(<WorkFilter projects={withPicture} thumbs={thumbs} />);
    const img = screen.getByRole('img', { name: 'A picture of a' });
    expect(img.getAttribute('src')).toBe('/_astro/a.webp');
    expect(img.getAttribute('loading')).toBe('lazy');
    expect(img.getAttribute('width')).toBe('360');
  });

  it('shows no image for entries without one', () => {
    render(<WorkFilter projects={withPicture} thumbs={thumbs} />);
    expect(screen.getAllByRole('img')).toHaveLength(1);
  });

  it('works without any thumbnails', () => {
    render(<WorkFilter projects={withPicture} />);
    expect(screen.queryAllByRole('img')).toHaveLength(0);
  });
});

describe('useWorkIndex', () => {
  it('shows an empty-state line and a zero count for a section with no entries', () => {
    const { result } = renderHook(() => useWorkIndex(projects));
    act(() => result.current.select('Rust'));
    expect(result.current.viewModel.entries).toEqual([]);
    expect(result.current.viewModel.countLabel).toBe('0 entries in Rust');
    expect(result.current.viewModel.emptyText).toMatch(/Nothing filed under Rust/);
  });

  it('returns to every entry when All is chosen again', () => {
    const { result } = renderHook(() => useWorkIndex(projects));
    act(() => result.current.select('Security'));
    act(() => result.current.select('All'));
    expect(result.current.viewModel.entries).toHaveLength(4);
    expect(result.current.viewModel.emptyText).toBeNull();
  });
});

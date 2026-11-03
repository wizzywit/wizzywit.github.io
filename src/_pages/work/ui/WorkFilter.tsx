import { describeProjectLink, extraProjectLinks, type Project } from '@/entities/project';
import { useWorkIndex } from '../use-cases/useWorkIndex';
import './WorkFilter.css';

export type Thumb = { src: string; width: number; height: number };

export function WorkFilter({ projects, thumbs = {} }: { projects: Project[]; thumbs?: Record<string, Thumb> }) {
  const { viewModel, select } = useWorkIndex(projects);
  return (
    <>
      <div role="group" aria-label="Filter by section" className="chips" data-ready={viewModel.ready}>
        {viewModel.filters.map((filter) => (
          <button key={filter.label} type="button" aria-pressed={filter.pressed} onClick={() => select(filter.label)}>
            {filter.label}
          </button>
        ))}
      </div>
      <p aria-live="polite" className="count">{viewModel.countLabel}</p>
      {viewModel.emptyText ? <p className="empty">{viewModel.emptyText}</p> : null}
      <ol className="entries">
        {viewModel.entries.map((entry) => (
          <li key={entry.slug} className={entry.href ? 'row row--link' : 'row'}>
            <span className="num">{entry.n}</span>
            {entry.image && thumbs[entry.slug] ? (
              <img className="thumb" src={thumbs[entry.slug]!.src} width={thumbs[entry.slug]!.width} height={thumbs[entry.slug]!.height} alt={entry.image.alt} loading="lazy" decoding="async" />
            ) : (
              <span className="thumb thumb--none" aria-hidden="true" />
            )}
            <div className="titleblock">
              <span className="kicker">{entry.kicker}</span>
              {entry.href ? (
                <a className="title" href={entry.href} {...(entry.external ? { rel: 'noopener' } : {})}>{entry.title}</a>
              ) : (
                <span className="plain">{entry.title}</span>
              )}
              {describeProjectLink(entry) ? (
                <span className="cta" aria-hidden="true">{describeProjectLink(entry)} {entry.external ? '↗' : '→'}</span>
              ) : null}
            </div>
            <p className="summary">{entry.summary}</p>
            <span className="role">{entry.role}</span>
            {extraProjectLinks(entry).length > 0 ? (
              <span className="extras">
                {extraProjectLinks(entry).map((link) => (
                  <a key={link.href} href={link.href} rel="noopener">{link.label} ↗</a>
                ))}
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </>
  );
}

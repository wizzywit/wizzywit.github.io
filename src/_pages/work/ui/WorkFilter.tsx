import type { Project } from '@/entities/project';
import { useWorkIndex } from '../use-cases/useWorkIndex';
import './WorkFilter.css';

export function WorkFilter({ projects }: { projects: Project[] }) {
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
          <li key={entry.slug} className="row">
            <span className="num">{entry.n}</span>
            <div className="titleblock">
              <span className="kicker">{entry.kicker}</span>
              {entry.href ? (
                <a href={entry.href} {...(entry.external ? { rel: 'noopener' } : {})}>{entry.title}</a>
              ) : (
                <span className="plain">{entry.title}</span>
              )}
            </div>
            <p className="summary">{entry.summary}</p>
            <span className="role">{entry.role}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

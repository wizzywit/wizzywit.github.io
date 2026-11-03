import { useThemeSwitch } from '../use-cases/useThemeSwitch';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { viewModel, toggle } = useThemeSwitch();
  return (
    <button type="button" className="theme-toggle" aria-pressed={viewModel.pressed} onClick={toggle}>
      {viewModel.label}
    </button>
  );
}

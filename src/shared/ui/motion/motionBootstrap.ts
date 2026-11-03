/**
 * Inlined in <head>. Switches motion on before first paint only for visitors who allow it, and gives up
 * after 4 s if the runtime never started, so content can never stay hidden.
 */
export const motionBootstrapScript = [
  '(function () {',
  '  try {',
  '    var root = document.documentElement;',
  '    if (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return;',
  '    root.classList.add("motion");',
  '    setTimeout(function () { if (!root.classList.contains("motion-live")) root.classList.remove("motion"); }, 4000);',
  '  } catch (e) {}',
  '})();',
].join('\n');

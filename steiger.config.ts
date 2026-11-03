import { defineConfig } from 'steiger';
import fsd from '@feature-sliced/steiger-plugin';

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // The skeleton has empty layers until content arrives; real violations still fail.
    files: ['./.steiger/src/**'],
    rules: {
      'fsd/insignificant-slice': 'off',
      // Steiger only knows FSD's default segment names; our segments are checked by tools/check-structure.ts.
      'fsd/no-segmentless-slices': 'off',
    },
  },
]);

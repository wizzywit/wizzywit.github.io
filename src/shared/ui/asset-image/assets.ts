const assets = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{png,jpg,jpeg,webp}', { eager: true });

/** Finds an image under src/assets by its path, e.g. "wired/canvas.png". A missing file fails the build. */
export function findAsset(name: string): ImageMetadata {
  const found = assets[`/src/assets/${name}`];
  if (!found) throw new Error(`Image not found under src/assets: ${name}`);
  return found.default;
}

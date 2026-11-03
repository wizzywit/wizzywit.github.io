// Unit tests never load content collections; they test mapping and rules. Calling these is a test bug.
const unavailable = (): never => {
  throw new Error('astro:content is not available in unit tests; test the pure mapping function instead');
};

export const getCollection = unavailable;
export const getEntry = unavailable;

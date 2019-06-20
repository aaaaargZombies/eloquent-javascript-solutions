// doesn't work because es6 modules and node aren't playing nice together.
import {parseItalic} from './md3.js';

describe('parseItalic', () => {
  const mdString = `This *should* be italic`;
  it('should recognise the italic syntax and split it into an array of strings and an object', () => {
    expect(parseItalic(mdString)).toBe('');
  });
});

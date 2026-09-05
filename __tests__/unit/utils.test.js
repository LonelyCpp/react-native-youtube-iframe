import {deepComparePlayList} from '../../src/utils';

describe('deepComparePlayList', () => {
  it('returns true for identical references', () => {
    const list = ['a', 'b'];
    expect(deepComparePlayList(list, list)).toBe(true);
  });

  it('returns true for equal string values', () => {
    expect(deepComparePlayList('a,b', 'a,b')).toBe(true);
  });

  it('returns true for arrays with same joined content', () => {
    expect(deepComparePlayList(['a', 'b'], ['a', 'b'])).toBe(true);
  });

  it('returns false for arrays with different content', () => {
    expect(deepComparePlayList(['a', 'b'], ['a', 'c'])).toBe(false);
  });

  it('returns false for arrays with different length', () => {
    expect(deepComparePlayList(['a', 'b'], ['a'])).toBe(false);
  });

  it('returns false when comparing array to string', () => {
    expect(deepComparePlayList(['a', 'b'], 'a,b')).toBe(false);
  });

  it('returns false when one is undefined', () => {
    expect(deepComparePlayList(undefined, ['a'])).toBe(false);
  });
});

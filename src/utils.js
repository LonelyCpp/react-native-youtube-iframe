/**
 * deep compares two values for the "playlist prop"
 *
 * @param {string | string[]} lastPlayList
 * @param {string | string[]} playList
 * @returns true if the two are equal
 */
const deepComparePlayList = (lastPlayList, playList) => {
  if (lastPlayList === playList) {
    return true;
  }

  if (Array.isArray(lastPlayList) && Array.isArray(playList)) {
    return lastPlayList.join('') === playList.join('');
  }

  return false;
};

export {deepComparePlayList};

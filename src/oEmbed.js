/**
 * @typedef {Object} youtubeMeta
 * @property {String} author_name
 * @property {String} author_url
 * @property {Number} height
 * @property {String} html
 * @property {String} provider_name
 * @property {String} provider_url
 * @property {Number} thumbnail_height
 * @property {String} thumbnail_url
 * @property {Number} thumbnail_width
 * @property {String} title
 * @property {String} type
 * @property {String} version
 * @property {Number} width
 */

/**
 * Fetch metadata of a youtube video using the oEmbed Spec -
 * https://oembed.com/#section7
 *
 * @param {String} videoId - youtube video id
 * @returns {Promise<youtubeMeta>} A promise that resolves into an object with the video metadata
 */
export const getYoutubeMeta = async videoId => {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
  );
  return await response.json();
};

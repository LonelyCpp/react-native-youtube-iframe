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
 * metadata -
 *
 * `thumbnail_url` - The url of the resource provider.
 *
 * `thumbnail_width` - The width of the video thumbnail.
 *
 * `thumbnail_height` - The height of the video thumbnail.
 *
 * `height` - The height in pixels required to display the HTML.
 *
 * `width` - The width in pixels required to display the HTML.
 *
 * `html` - The HTML required to embed a video player.
 *
 * `author_url` - youtube channel link of the video
 *
 * `title` - youtube video title
 *
 * `provider_name` - The name of the resource provider.
 *
 * `author_name` - The name of the author/owner of the video.
 *
 * `provider_url` - The url of the resource provider.
 *
 * `version` - The oEmbed version number.
 *
 * `type` - The resource type.
 *
 *
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

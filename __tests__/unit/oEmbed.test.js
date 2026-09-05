import {getYoutubeMeta} from '../../src/oEmbed';

describe('getYoutubeMeta', () => {
  const videoId = 'abc123';

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('fetches the oEmbed endpoint for the given video id', async () => {
    const mockJson = jest.fn().mockResolvedValue({title: 'Test video'});
    const mockFetch = jest.fn().mockResolvedValue({json: mockJson});
    global.fetch = mockFetch;

    const meta = await getYoutubeMeta(videoId);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`,
    );
    expect(meta).toEqual({title: 'Test video'});
  });

  it('returns the parsed metadata', async () => {
    const expected = {
      title: 'Never Gonna Give You Up',
      author_name: 'Rick Astley',
      thumbnail_url: 'https://img.example.com/thumb.jpg',
    };
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(expected),
    });

    const meta = await getYoutubeMeta(videoId);
    expect(meta).toEqual(expected);
  });
});

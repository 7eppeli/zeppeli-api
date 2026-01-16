const axios = require('axios');

async function tiktok(query) {
  try {
    const encodedParams = new URLSearchParams();
    encodedParams.set('url', query);
    encodedParams.set('hd', '1');

    const response = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: encodedParams
    });

    const videos = response.data.data;
    const result = {
      title: videos.title,
      cover: videos.cover,
      origin_cover: videos.origin_cover,
      no_watermark: videos.play,
      watermark: videos.wmplay,
      music: videos.music_info?.play || videos.music,
      image: videos.images || []
    };

    return result;
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch TikTok video.');
  }
}
module.exports = function(app) {
    app.get('/dl/tt', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await tiktok(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
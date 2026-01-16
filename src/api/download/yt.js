const axios = require('axios');

async function ytdl(url) {
  const response = await axios.get('https://api.vidfly.ai/api/media/youtube/download', {
    headers: {
      'Content-Type': 'application/json',
      'X-App-Name': 'vidfly-web',
      'X-App-Version': '1.0.0'
    },
    params: { url }
  });

  return response.data.data 
}
module.exports = function(app) {
    app.get('/dl/yt', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await ytdl(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
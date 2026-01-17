async function ttstalk(username) {
  const url = `https://api.buzzlytics.io/metadata?username=${username}&service=tiktok`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36',
      Referer: `https://www.tiktokviewcount.com/profile/tiktok/@${username}`,
    },
  });

  const data = await response.json();
  return data.data
}
module.exports = function(app) {
    app.get('/st/tt', async (req, res) => {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
              status: false,
              error: '"username" is required'
            });
        }
        try {
            const result = await ttstalk(username);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}

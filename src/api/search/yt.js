const yts = require('yt-search');

async function ytser(query) {
  try {
    const results = await yts(query);
    return result.all
  } catch (error) {
    throw new Error(`Error searching YouTube: ${error.message}`)
  }
}
module.exports = function(app) {
    app.get('/sr/yt', async (req, res) => {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
              status: false,
              error: '"query" is required'
            });
        }
        try {
            const result = await ytser(query);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
const axios = require('axios');
const cheerio = require('cheerio');
const baseUrl = 'https://auratail.vip/anime/?status=&type=&order=update'

async function scrapeData() {
  try {
    const { data } = await axios.get(baseUrl, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })
    const $ = cheerio.load(data)
    const results = []

    $('.listupd .bsx').each((_, el) => {
      const title = $(el).find('.tt h2').text().trim()
      const episode = $(el).find('.bt .epx').text().trim()
      const link = $(el).find('a').attr('href')
      const image =
        $(el).find('img').attr('data-src') || $(el).find('img').attr('src')
      results.push({ title, episode, link, image })
    })

    return results
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to scrape data from Auratail")
  }
}
module.exports = function(app) {
    app.get('/anime/latest', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await getAnimeDetail(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
  }

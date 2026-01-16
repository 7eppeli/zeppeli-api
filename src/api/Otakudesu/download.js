const axios = require("axios");
const cheerio = require("cheerio");
const proxy = () => null

async function getAnimeDownloadLinks(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 30000,
    })
    const $ = cheerio.load(data)

    const episodeInfo = {
      title: $(".download h4").text().trim(),
      downloads: []
    }

    $(".download ul li").each((index, element) => {
      const quality = $(element).find("strong").text().trim()
      const links = $(element)
        .find("a")
        .map((i, el) => ({
          quality,
          link: $(el).attr("href"),
          host: $(el).text().trim(),
        }))
        .get()
      episodeInfo.downloads.push(...links)
    })
    return episodeInfo
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/otaku/download', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await getAnimeDownloadLinks(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
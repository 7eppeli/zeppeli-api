const axios = require("axios");
const cheerio = require("cheerio");

const proxy = () => null

const baseUrl = "https://otakudesu.cloud/"

async function getOngoingAnime() {
  try {
    const { data } = await axios.get(baseUrl, {
      timeout: 30000,
    })
    const $ = cheerio.load(data)
    const results = []

    $(".venz ul li").each((index, element) => {
      const episode = $(element).find(".epz").text().trim()
      const type = $(element).find(".epztipe").text().trim()
      const date = $(element).find(".newnime").text().trim()
      const title = $(element).find(".jdlflm").text().trim()
      const link = $(element).find("a").attr("href")
      const image = $(element).find("img").attr("src")

      results.push({
        episode,
        type,
        date,
        title,
        link,
        image,
      })
    })

    return results
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/otaku/ongoing', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await getOngoingAnime(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
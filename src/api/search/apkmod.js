const axios = require("axios");
const cheerio = require("cheerio");

async function searchApk(search) {
  try {
    const response = await axios.get(
      `https://an1.com/?story=${search}&do=search&subaction=search`,
      {
        timeout: 30000,
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
      },
    )
    const $ = cheerio.load(response.data)
    const applications = []
    $(".item").each((index, element) => {
      const $element = $(element)
      const app = {
        title: $element.find(".name a span").text().trim(),
        link: $element.find(".name a").attr("href"),
        developer: $element.find(".developer").text().trim(),
        image: $element.find(".img img").attr("src"),
        rating: {
          value: parseFloat($element.find(".current-rating").text()) || null,
          percentage: parseInt(
            $element
              .find(".current-rating")
              .attr("style")
              ?.replace("width:", "")
              .replace("%;", "") || "0",
          ),
        },
        type: $element.find(".item_app").hasClass("mod") ? "MOD" : "Original",
      }
      applications.push(app)
    })
    return applications
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/sr/apk', async (req, res) => {
        const { query } = req.query;
        if (!query && !type) {
            return res.status(400).json({
              status: false,
              error: '"query" is required'
            });
        }
        try {
            const result = await searchApkMod(query);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({
              status: false,
              error: error.message
            });
        }
    });
}
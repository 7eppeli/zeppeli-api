const axios = require("axios");
const cheerio = require("cheerio");

const proxy = () => null;
const baseUrl = "https://otakudesu.cloud/";

async function searchAnime(query) {
  const url = `${baseUrl}/?s=${query}&post_type=anime`
  try {
    const { data } = await axios.get(url, {
      timeout: 30000,
    })
    const $ = cheerio.load(data)
    const animeList = []

    $(".chivsrc li").each((index, element) => {
      const title = $(element).find("h2 a").text().trim()
      const link = $(element).find("h2 a").attr("href")
      const imageUrl = $(element).find("img").attr("src")
      const genres = $(element)
        .find(".set")
        .first()
        .text()
        .replace("Genres : ", "")
        .trim()
      const status = $(element)
        .find(".set")
        .eq(1)
        .text()
        .replace("Status : ", "")
        .trim()
      const rating =
        $(element).find(".set").eq(2).text().replace("Rating : ", "").trim() ||
        "N/A"

      animeList.push({
        title,
        link,
        imageUrl,
        genres,
        status,
        rating,
      })
    })
    return animeList
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/otaku/search', async (req, res) => {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({
              status: false,
              error: '"query" is required'
            });
        }
        try {
            const result = await searchAnime(query);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
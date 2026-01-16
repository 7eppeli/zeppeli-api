const axios = require("axios");
const cheerio = require("cheerio");
const proxy =() => null

async function getAnimeDetail(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 30000,
    })
    const $ = cheerio.load(data)

    const animeInfo = {
      title: $(".fotoanime .infozingle p span b:contains('Judul')")
        .parent()
        .text()
        .replace("Judul: ", "")
        .trim(),
      japaneseTitle: $(".fotoanime .infozingle p span b:contains('Japanese')")
        .parent()
        .text()
        .replace("Japanese: ", "")
        .trim(),
      score: $(".fotoanime .infozingle p span b:contains('Skor')")
        .parent()
        .text()
        .replace("Skor: ", "")
        .trim(),
      producer: $(".fotoanime .infozingle p span b:contains('Produser')")
        .parent()
        .text()
        .replace("Produser: ", "")
        .trim(),
      type: $(".fotoanime .infozingle p span b:contains('Tipe')")
        .parent()
        .text()
        .replace("Tipe: ", "")
        .trim(),
      status: $(".fotoanime .infozingle p span b:contains('Status')")
        .parent()
        .text()
        .replace("Status: ", "")
        .trim(),
      totalEpisodes: $(
        ".fotoanime .infozingle p span b:contains('Total Episode')",
      )
        .parent()
        .text()
        .replace("Total Episode: ", "")
        .trim(),
      duration: $(".fotoanime .infozingle p span b:contains('Durasi')")
        .parent()
        .text()
        .replace("Durasi: ", "")
        .trim(),
      releaseDate: $(
        ".fotoanime .infozingle p span b:contains('Tanggal Rilis')",
      )
        .parent()
        .text()
        .replace("Tanggal Rilis: ", "")
        .trim(),
      studio: $(".fotoanime .infozingle p span b:contains('Studio')")
        .parent()
        .text()
        .replace("Studio: ", "")
        .trim(),
      genres: $(".fotoanime .infozingle p span b:contains('Genre')")
        .parent()
        .text()
        .replace("Genre: ", "")
        .trim(),
      imageUrl: $(".fotoanime img").attr("src"),
    }

    const episodes = []
    $(".episodelist ul li").each((index, element) => {
      const episodeTitle = $(element).find("span a").text()
      const episodeLink = $(element).find("span a").attr("href")
      const episodeDate = $(element).find(".zeebr").text()
      episodes.push({
        title: episodeTitle,
        link: episodeLink,
        date: episodeDate,
      })
    })

    return {
      animeInfo,
      episodes,
    }
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/otaku/detail', async (req, res) => {
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
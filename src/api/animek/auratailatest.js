const axios = require('axios');
const cheerio = require('cheerio');

async function getBaseUrl() {
  try {
    const response = await axios.get(proxy() + "https://samehadaku.care/", {
      timeout: 30000,
    })
    const $ = cheerio.load(response.data)
    const scriptContent = $('script')
      .filter(function () {
        return $(this).html().includes("window.location.href")
      })
      .html()

    const urlMatch = scriptContent.match(
      /window\.location\.href\s*=\s*['"]([^'"]+)['"]/,
    )
    if (urlMatch) {
      return urlMatch[1]
    } else {
      throw new Error("Base URL not found")
    }
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}

async function scrapeData() {
  try {
    const baseUrl = await getBaseUrl()
    const url = baseUrl + "/anime-terbaru/"
    const response = await axios.get(url, {
      headers: {
        "authority": "samehadaku.care",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "max-age=0",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      },
      timeout: 30000,
    })

    if (response.statusText !== "OK") throw new Error("Website is down")

    const $ = cheerio.load(response.data)
    const ul = $("div.post-show > ul").children("li")

    const animeList = []
    ul.each((i, el) => {
      animeList.push({
        title: $(el)
          .find("h2.entry-title")
          .text()
          .trim()
          .split(" Episode")[0],
        thumbnail: $(el).find("div.thumb > a > img").attr("src") || "",
        postedBy: $(el)
          .find("span[itemprop='author'] > author")
          .text()
          .trim(),
        episode: $(el).find("span").eq(0).find("author").text().trim(),
        release: $(el)
          .find("span[itemprop='author']")
          .next()
          .contents()
          .eq(3)
          .text()
          .split(": ")[1]
          .trim(),
        link: $(el).find("a").attr("href") || "",
      })
    })

    return {
      total: animeList.length,
      anime: animeList,
    }
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get response from API")
  }
}
module.exports = function(app) {
    app.get('/anime/latest', async (req, res) => {
        try {
            const result = await scrapeData();
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
  }

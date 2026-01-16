const axios = require("axios");

const createImageResponse = (buffer, filename = null) => {
  const headers = {
    "Content-Type": "image/jpeg",
    "Content-Length": buffer.length.toString(),
    "Cache-Control": "public, max-age=3600",
  }

  if (filename) {
    headers["Content-Disposition"] = `inline; filename="${filename}"`
  }

  return new Response(buffer, { headers })
}

async function getRandomWaifuImage() {
  try {
    const API_URL = "https://api.waifu.pics/sfw/waifu"
    const { data } = await axios.get(API_URL, {
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!data || !data.url) {
      throw new Error("Invalid response from external API: Missing image URL.")
    }

    const imageUrl = data.url
    const imageResponse = await axios.get(imageUrl, {
      responseType: "arraybuffer",
      timeout: 30000,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })
    return Buffer.from(imageResponse.data, "binary")
  } catch (error) {
    console.error("API Error:", error.message)
    throw new Error("Failed to get random waifu image from API")
  }
}

module.exports = function(app) {
    app.get('/random/istri', async (req, res) => {
        try {
            const istri = await getRandomWaifuImage();
            res.writeHead(200, {
                'Content-Type': 'image/png',
                'Content-Length': istri.length,
            });
            res.end(istri);
        } catch (error) {
            res.status(500).send(`Error: ${error.message}`);
        }
    });
};

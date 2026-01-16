const axios = require('axios');
const cheerio = require('cheerio');

async function tgstalk(username) {
  const url = 'https://t.me/' + username;
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
      }
    });
    const html = response.data;
    const $ = cheerio.load(html);
    const data = {};
    
    const title = $('title').text();
    data.name = title || null;
    
    const image = $('meta[property="og:image"]').attr('content');
    data.image = image || null;

    const bio = $('meta[property="og:description"]').attr('content');
    data.bio = bio || null;
    data.username = username;
    
    const fullName = $('.tgme_page_title span').first().text().trim();
    if (fullName) {
      data.full_name = fullName;
    } else {
      data.full_name = null;
    }

    return data;
  } catch (err) {
    console.error('Username Tidak di temukan.');
    return err;
  }
}

module.exports = function(app) {
    app.get('/st/tg', async (req, res) => {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
              status: false,
              error: '"username" is required'
            });
        }
        try {
            const result = await tgstalk(username);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
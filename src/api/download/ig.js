const axios = require('axios');

class InstagramDownloader {
  constructor() {
    this.apiUrl = 'https://api.downloadgram.org/media';
    this.baseHeaders = {
      accept: '*/*',
      'accept-language': 'id-ID,id;q=0.9',
      'cache-control': 'no-cache',
      'content-type': 'application/x-www-form-urlencoded',
      origin: 'https://downloadgram.org',
      pragma: 'no-cache',
      priority: 'u=1, i',
      referer: 'https://downloadgram.org/',
      'sec-ch-ua': '"Lemur";v="135", "", "", "Microsoft Edge Simulate";v="135"',
      'sec-ch-ua-mobile': '?1',
      'sec-ch-ua-platform': '"Android"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
      'user-agent':
        'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'
    };
  }

  async download({ url, version = '3', language = 'en' }) {
    const postData = new URLSearchParams({ url, v: version, lang: language });
    const res = await axios.post(this.apiUrl, postData, {
      headers: this.baseHeaders
    });
    return this.parseResponse(res.data);
  }

  parseResponse(responseData) {
    const start = responseData.indexOf('innerHTML ="') + 'innerHTML ="'.length;
    const end = responseData.indexOf('";downloadMore()', start);
    if (start === -1 || end === -1) return [];

    let html = responseData
      .substring(start, end)
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .replace(/\\n/g, '\n')
      .replace(/\\t/g, '\t');

    const $ = cheerio.load(html);
    const media = [];

    $('video source').each((_, el) => {
      const url = this.cleanUrl($(el).attr('src'));
      const poster = this.cleanUrl($('video').attr('poster'));
      if (url) media.push({ type: 'video', url, poster });
    });

    $('img').each((_, el) => {
      const url = this.cleanUrl($(el).attr('src'));
      if (url && url.includes('cdn.downloadgram.org')) {
        media.push({ type: 'image', url });
      }
    });

    return media;
  }

  cleanUrl(url) {
    if (!url) return null;
    return url
      .replace(/^["'\\]+|["'\\]+$/g, '')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
      .trim();
  }

  validateInstagramUrl(url) {
    return /^https:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[a-zA-Z0-9_-]+/.test(url);
  }
}

async function igdl(url) {
  const downloader = new InstagramDownloader();
  if (!downloader.validateInstagramUrl(url)) return [];
  return await downloader.download({ url });
}
module.exports = function(app) {
    app.get('/dl/ig', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const result = await igdl(url);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
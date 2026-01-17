const axios = require('axios');
const { Jimp } = require('jimp');
const ImageToAscii = require('image-to-ascii');
module.exports = function(app) {
    app.get('/ascii/convert', async (req, res) => {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({
              status: false,
              error: '"url" is required'
            });
        }
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
    
            const img = await Jimp.read(response.data);
            img.resize(80, Jimp.AUTO);
    
            const bufferResized = await img.getBufferAsync(Jimp.MIME_PNG);
    
            ImageToAscii(bufferResized, { colored: false }, (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Error mengconvert gambar ke ASCII');
                }
                res.set('Content-Type', 'text/plain');
                res.(200)json({
                    status: true,
                    result
                });
            });
    
        } catch (error) {
            console.error(error);
            res.status(500).json({
                status: false
                message: 'Error mengambil atau memproses gambar'
            });
        }
    });
}

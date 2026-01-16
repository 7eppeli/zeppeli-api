async function igstalk(username) {
  const res = await fetch("https://free-tools-api.vercel.app/api/instagram-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
      Referer: "https://www.boostfluence.com/free-tools/instagram-profile-viewer"
    },
    body: JSON.stringify({ username })
  });

  const contentType = res.headers?.get?.("content-type")?.toString() || "";

  return contentType.includes("application/json") ? res.json() : res.text();
}
module.exports = function(app) {
    app.get('/st/ig', async (req, res) => {
        const { username } = req.query;
        if (!username) {
            return res.status(400).json({
              status: false,
              error: '"username" is required'
            });
        }
        try {
            const result = await igstalk(username);
            res.status(200).json({
                status: true,
                result
            });
        } catch (error) {
            res.status(500).json({ status: false, error: error.message });
        }
    });
}
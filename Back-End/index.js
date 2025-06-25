const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");

const app = express();
const PORT = 3000;
const SONGS_DIR = path.join(__dirname, "songs");

app.use(cors());
app.use("/songs", express.static(SONGS_DIR));

app.get("/api/songs", async (req, res) => {
  try {
    const files = fs.readdirSync(SONGS_DIR).filter(file =>
      /\.(mp3|wav|ogg)$/i.test(file)
    );

    const songs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(SONGS_DIR, file);
        const metadata = await mm.parseFile(filePath);
        const title = metadata.common.title || path.parse(file).name;
        const artist = metadata.common.artist || "Sconosciuto";
        const duration = metadata.format.duration || 0;

        return {
          title,
          artist,
          duration,
          file,
          url: `http://localhost:${PORT}/songs/${file}`,
        };
      })
    );

    res.json(songs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Errore nel leggere i file audio." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Backend avviato su http://localhost:${PORT}`);
});

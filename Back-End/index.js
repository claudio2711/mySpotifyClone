const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");

const app = express();
const PORT = 3000;
const SONGS_DIR = path.join(__dirname, "songs");

// Middleware
app.use(cors());
app.use("/songs", express.static(SONGS_DIR));

/**
 * GET /api/songs
 * Restituisce un array di oggetti con i metadati dei file audio
 */
app.get("/api/songs", async (req, res) => {
  try {

    const files = fs
      .readdirSync(SONGS_DIR)
      .filter((file) => /\.(mp3|wav|ogg)$/i.test(file));

  
    const songs = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(SONGS_DIR, file);
        const metadata = await mm.parseFile(filePath);
        console.log(
  file,
  " pictures → ",
  metadata.common.picture ? metadata.common.picture.length : 0
);

        const title    = metadata.common.title  || path.parse(file).name;
        const artist   = metadata.common.artist || "Sconosciuto";
        const album    = metadata.common.album  || "Sconosciuto";
        const duration = metadata.format.duration || 0;

       
       let pictureUrl = null;
if (metadata.common.picture && metadata.common.picture.length > 0) {
  const pic   = metadata.common.picture[0];      // prima immagine
  const base  = Buffer.from(pic.data).toString("base64"); // <<< fix
  pictureUrl  = `data:${pic.format};base64,${base}`;
}


        return {
          title,
          artist,
          album,
          duration,
          pictureUrl, // <-- nuovo campo
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

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Backend avviato su http://localhost:${PORT}`);
});

import fs from "fs";
import http from "http";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

const PORT = 8000;
const HOSTNAME = "localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS
});
const bucketName = "kieling-portfolio-images";
const baseUrl = "https://storage.googleapis.com";

const app = express();
const router = express.Router();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

async function listObjects() {
  const [files] = await storage.bucket(bucketName).getFiles();
  return files;
}

listObjects().catch(console.log);

app.use(router);
app.use(express.static(path.join(__dirname, "/public")));

router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "home.html"));
});

app.get("/images/small/:category", async (req, res) => {
  const { category } = req.params;
  switch (category) {
    case "concerts": {
      const bucketName = "kieling-portfolio-images-concerts-small";
      const files = await listObjects();
      res.status(200).json(
        files.map(item => {
          return {
            itemName: item.name,
            url: (baseUrl + "/" + bucketName + "/" + item.name).replace(
              " ",
              "%20"
            )
          };
        })
      );
    }
    case "bw": {
      const bucketName = "kieling-portfolio-images-bw-small";
      const files = await listObjects();
      res.status(200).json(
        files.map(item => {
          return {
            itemName: item.name,
            url: (baseUrl + "/" + bucketName + "/" + item.name).replace(
              " ",
              "%20"
            )
          };
        })
      );
    }

    default:
      res.end();
  }
});

const server = http.createServer(app);

server.listen(PORT, HOSTNAME, null, () => {
  console.log("listening on port " + PORT);
});

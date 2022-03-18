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
  keyFilename: "api_key.json"
});
const bucketName = "kieling-portfolio-images";
const baseUrl = "https://storage.googleapis.com";

async function listObjects() {
  const [files] = await storage.bucket(bucketName).getFiles();
  return files;
}

listObjects().catch(console.log);

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.get("/images/:category", async (req, res) => {
  switch (req.params.category) {
    case "commercial":
      const files = await listObjects();
      res.json(
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
    default:
      res.end();
  }
});

const server = http.createServer(app);

server.listen(PORT, HOSTNAME, null, () => {
  console.log("listening on port " + PORT);
});

import http from "http";
import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

import { generateJSON, bucketBaseName } from "./server_helpers/helpers.js";

const PORT = 8000;
const HOSTNAME = "localhost";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const storage = new Storage({
  keyFilename: process.env.GOOGLE_APLICATION_CREDENTIALS
});

const app = express();
const router = express.Router();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
  console.log("header set");
  next();
});

async function listObjects(id) {
  const [files] = await storage.bucket(bucketBaseName.concat(id)).getFiles();
  return files;
}

async function getFiles(bucketId) {
  return await listObjects(bucketId);
}

listObjects().catch(console.log);

app.use(router);
app.use(express.static(path.join(__dirname, "/public")));

app.get("/images/small/:category", async (req, res) => {
  const { category } = req.params;
  switch (category) {
    case "concerts": {
      const bucketId = "concerts-small";
      const files = await getFiles(bucketId);
      return res.status(200).json(generateJSON(files, bucketId)).end();
    }
    case "bw": {
      const bucketId = "bw-small";
      const files = await getFiles(bucketId);
      return res.status(200).json(generateJSON(files, bucketId)).end();
    }
    default:
      res.end();
  }
});

const server = http.createServer(app);

server.listen(PORT, HOSTNAME, null, () => {
  console.log("listening on port " + PORT);
});

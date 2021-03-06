import http from "http";
import express from "express";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";

import { generateJSON, bucketBaseName } from "./server_helpers/helpers.js";

const PORT = 8000;
const HOSTNAME = "localhost";

const storage = new Storage();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-type");
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

app.use(router);

app.get("/images/small/:bucket", async (req, res) => {
  const { bucket } = req.params;
  switch (bucket) {
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

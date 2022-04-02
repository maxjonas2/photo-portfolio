// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { Storage } = require("@google-cloud/storage");

const baseUrl = "https://storage.googleapis.com";
const bucketBaseName = "kieling-portfolio-images-";
const storage = new Storage({
  projectId: "photo-portolio "
});

let origin = "";

function generateJSON(files, bucketId) {
  return files.map(item => {
    return {
      bucket: bucketId,
      name: item.name,
      url: (
        baseUrl +
        "/" +
        bucketBaseName.concat(bucketId) +
        "/" +
        item.name
      ).replace(" ", "%20")
    };
  });
}

async function listObjects(id) {
  const [files] = await storage.bucket(bucketBaseName.concat(id)).getFiles();
  return files;
}

async function getFiles(bucketId) {
  return await listObjects(bucketId);
}

function verifyOrigin() {
  const allowedPorts = ["8888", "80", "5500", "3000", "9000"];
  const allowedUrls = [
    "http://localhost",
    "http://jkieling.com",
    "http://127.0.0.1"
  ];
  const allowedOrigins = [];
  allowedUrls.forEach(url => {
    allowedPorts.forEach(port => {
      allowedOrigins.push(url + ":" + port);
    });
  });
  return allowedOrigins.includes(origin);
}

function getResponse(body, statusCode = 200) {
  body = typeof body === "string" ? body : JSON.stringify(body);
  return {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": verifyOrigin() ? origin : "null"
    },
    body
  };
}

const handler = async event => {
  origin = event.headers.origin;
  try {
    const bucket = event.queryStringParameters.bucket || "concerts";
    switch (bucket) {
      case "concerts": {
        const bucketId = "concerts-small";
        const files = await getFiles(bucketId);
        return getResponse(generateJSON(files, bucketId));
      }
      case "bw": {
        const bucketId = "bw-small";
        const files = await getFiles(bucketId);
        return getResponse(generateJSON(files, bucketId));
      }
      case "portrait": {
        const bucketId = "portrait-small";
        const files = await getFiles(bucketId);
        return getResponse(generateJSON(files, bucketId));
      }
      default:
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Not found" })
        };
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() };
  }
};

module.exports = { handler };

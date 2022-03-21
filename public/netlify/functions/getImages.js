// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const { Storage } = require("@google-cloud/storage");

const handler = async event => {
  const baseUrl = "https://storage.googleapis.com";
  const bucketBaseName = "kieling-portfolio-images-";
  const storage = new Storage();

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

  try {
    const bucket = event.queryStringParameters.bucket || "concerts";
    switch (bucket) {
      case "concerts": {
        const bucketId = "concerts-small";
        const files = await getFiles(bucketId);
        return {
          statusCode: 200,
          body: JSON.stringify(generateJSON(files, bucketId))
        };
      }
      case "bw": {
        const bucketId = "bw-small";
        const files = await getFiles(bucketId);
        return {
          statusCode: 200,
          body: JSON.stringify(generateJSON(files, bucketId))
        };
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

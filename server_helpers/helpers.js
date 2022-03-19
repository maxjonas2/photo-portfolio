export const baseUrl = "https://storage.googleapis.com";
export const bucketBaseName = "kieling-portfolio-images-";

export function generateJSON(files, bucketId) {
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

export function setCors(app) {
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
  });
}

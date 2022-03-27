// const { builder } = require("@netlify/functions");

module.exports.handler = async function handler(event, context) {
  return {
    body: "<p>Hello world</p>",
    headers: { "Content-Type": "text/html" },
    statusCode: 200
  };
};

const axios = require("axios");

const LOG_URL = "http://20.244.56.144/evaluation-service/logs";

async function LOG(stack, level, pkg, message) {
  try {
    await axios.post(LOG_URL, {
      stack,
      level,
      package: pkg,
      message,
    });
    console.log(`[${level}] (${pkg}) ${message}`);
  } catch (error) {
    console.log("Error: ", error);
  }
}

module.exports = { LOG };

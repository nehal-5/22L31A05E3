import axios from "axios";

const LOG_URL = "http://20.244.56.144/evaluation-service/logs";

export async function LOG(stack, level, pkg, message) {
    try {
        await axios.post(LOG_URL, {
            stack,
            level,
            package: pkg,
            message
        })
        console.log(`[${level}] (${pkg}): ${message}`)
  } catch (error) {
    console.log("frontend log: ", error.message);
  }
}

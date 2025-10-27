import { Queue } from "bullmq";
import config from "../../config/config.js";


export const abandonedCartQueue = new Queue(
  "abandoned-cart-notify",
  {
    connection: {
      host: config.redisHost,
      port: config.redisPort,
    }
  }
);
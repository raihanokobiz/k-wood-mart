import { Worker } from "bullmq";
import config from "../../config/config.js";
import { abandonedCouponAssign } from "./abandonedCouponAssign.js";


export const abandonedCartWorker = new Worker(
  "abandoned-cart-notify",
  async (job) => {
    await abandonedCouponAssign(job?.data);
  },
  {
    autorun: false,
    connection: {
      host: config.redisHost,
      port: config.redisPort,
    }
  }
);
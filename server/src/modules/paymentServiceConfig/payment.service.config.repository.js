// const { PaymentServiceConfigSchema } = require("../../models/index.js");
const { PaymentServiceConfigSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class PaymentServiceConfigRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createPaymentServiceConfig(payload, session) {
    // const existingPaymentServiceConfig = await this.#model
    //   .find({}, null, { session })
    //   .sort({ createdAt: -1 });
    // const deleteResult = await this.#model.deleteMany({}, { session });
    // if (deleteResult.deletedCount > 0) {
    //   for (const paymentServiceConfig of existingPaymentServiceConfig) {
    //     if (paymentServiceConfig.image) {
    //       try {
    //         await removeUploadFile(paymentServiceConfig.image);
    //       } catch (fileError) {
    //         console.error(`Failed to remove file: ${paymentServiceConfig.image}`, fileError);
    //       }
    //     }
    //   }
    // }

    const newPaymentServiceConfig = await this.#model.create([payload], {
      session,
    });
    return newPaymentServiceConfig;
  }

  async updatePaymentServiceConfig(id, payload) {
    const updatedPaymentServiceConfig = await this.#model.findByIdAndUpdate(
      id,
      payload
    );
    if (!updatedPaymentServiceConfig) {
      throw new Error("About Us not found");
    }
    return updatedPaymentServiceConfig;
  }

  async getPaymentServiceConfigWithPagination(payload) {
    try {
      const paymentServiceConfigs = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const paymentServiceConfigs = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalPaymentServiceConfig = await this.#model.countDocuments();

          return {
            doc: paymentServiceConfigs,
            totalDoc: totalPaymentServiceConfig,
          };
        }
      );

      return paymentServiceConfigs;
    } catch (error) {
      console.error(
        "Error getting paymentServiceConfigs with pagination:",
        error
      );
      throw error;
    }
  }
}

module.exports = new PaymentServiceConfigRepository(PaymentServiceConfigSchema);

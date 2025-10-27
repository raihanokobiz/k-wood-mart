const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PaymentServiceConfigschema = new Schema(
  {
    serviceMethod: {
      type: String,
      enum: ["STEADFAST", "PATHAO", "BKASH"],
      default: "STEADFAST",
    },
    baseUrl: {
      type: String,
    },
    userName: {
      type: String,
    },
    apiKey: {
      type: String,
    },
    secretKey: {
      type: String,
    },
    clientKey: {
      type: String,
    },
    clientId: {
      type: String,
    },
    clientSecret: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    grantType: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const PaymentServiceConfigSchema = mongoose.model(
  "paymentServiceConfig",
  PaymentServiceConfigschema
);

module.exports = { PaymentServiceConfigSchema };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShippingMethodschema = new Schema(
  {
    shippingMethod: {
      type: String,
    },
    rate: {
      type: Number,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const ShippingMethodSchema = mongoose.model(
  "shippingMethod",
  ShippingMethodschema
);

module.exports = { ShippingMethodSchema };

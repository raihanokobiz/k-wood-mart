const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderBulkschema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,

    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,

    },
    companyName: {
      type: String,
    },
    productType: {
      type: String,

    },
    deliveryDate: {
      type: Date,

    },
    quantity: {
      type: Number,

    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

const OrderBulkSchema = mongoose.model("orderBulk", OrderBulkschema);

module.exports = { OrderBulkSchema };

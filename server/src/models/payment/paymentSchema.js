const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Paymentschema = new Schema(
  {
    warehouseRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "warehouse",
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "order",
    },
    amount: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const PaymentSchema = mongoose.model("payment", Paymentschema);

module.exports = { PaymentSchema };

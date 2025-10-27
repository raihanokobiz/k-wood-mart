const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Cartschema = new Schema(
  {
    quantity: {
      type: Number,
    },
    // color: {
    //   type: String,
    // },
    // size: {
    //   type: String,
    // },
    isGuestUser: {
      type: Boolean,
      default: false,
    },
    guestUserRef: {
      type: String,
    },

    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    correlationId: {
      type: String,
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    inventoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "inventory",
    },
  },
  { timestamps: true }
);

const CartSchema = mongoose.model("cart", Cartschema);

module.exports = { CartSchema };

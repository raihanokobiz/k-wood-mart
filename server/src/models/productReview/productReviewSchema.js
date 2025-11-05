const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReviewschema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    district: {
      type: String,
    },
    comment: {
      type: String,
    },
    status: {
      type: Boolean,
      default: false,
    },
    // rating: {
    //   type: Number,
    // },
    // userRef: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "user",
    // },
    // productRef: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "product",
    // },
  },
  { timestamps: true }
);

const ProductReviewSchema = mongoose.model(
  "productReview",
  ProductReviewschema
);

module.exports = { ProductReviewSchema };

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductReviewschema = new Schema(
  {
    image: {
      type: String,
    },
    name: {
      type: String,
    },
    rating: {
      type: Number,
    },
    comment: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    productRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
  },
  { timestamps: true }
);

const ProductReviewSchema = mongoose.model(
  "productReview",
  ProductReviewschema
);

module.exports = { ProductReviewSchema };

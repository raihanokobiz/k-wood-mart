const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Wishlistschema = new Schema(
  {
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

const WishlistSchema = mongoose.model("wishlist", Wishlistschema);

module.exports = { WishlistSchema };

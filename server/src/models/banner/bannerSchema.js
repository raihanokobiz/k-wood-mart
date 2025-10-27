const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Bannerschema = new Schema(
  {
    image: {
      type: String,
    },
    title: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    bannerCategory: {
      type: String, //promotion, offer, announcement etc.
      trim: true,
    },
    type: {
      type: String,
      enum: [
        "MAIN BANNER",
        "CATEGORY BANNER",
        "BEST SALE BANNER",
        "NEWSLETTER BANNER",
        "SHOP BANNER",
        "PROMO BANNER",
        "UPCOMING BANNER"
      ],
      default: "MAIN BANNER",
    },
    status: {
      type: Boolean,
      default: true,
    },
    link: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const BannerSchema = mongoose.model("banner", Bannerschema);

module.exports = { BannerSchema };

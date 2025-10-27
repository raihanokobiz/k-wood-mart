const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Couponschema = new Schema(
  {
    code: {
      type: String,
    },
    discount: {
      type: Number,
    },
    useLimit: {
      type: Number,
      default: 0,
    },
    used: {
      type: Number,
      default: 0,
    },
    startDate: {
      type: Date,
    },
    expireDate: {
      type: Date,
    },
    userInfo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    }],
    discountType: {
      type: String,
      enum: ["brand", "category", "subCategory"],
    },
    brandRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: "category",
    },
    subCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
  },
  { timestamps: true }
);

const CouponSchema = mongoose.model("coupon", Couponschema);

module.exports = { CouponSchema };

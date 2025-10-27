const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const Productschema = new Schema(
  {
    productId: { type: String },
    name: {
      type: String,
    },
    description: {
      type: String,
    },
    isDiscounted: {
      type: Boolean,
      default: false,
    },
    discountType: {
      type: String,
      enum: ["flat", "percent"],
    },
    discount: {
      type: Number,
    },
    // discountAmount: {
    //   type: Number,
    // },
    price: {
      type: Number,
    },
    // mrpPrice: {
    //   type: Number,
    // },
    // warehousePrice: {
    //   type: Number,
    //   default: 0,
    // },
    // warehouseProfit: {
    //   type: Number,
    //   default: 0,
    // },
    // wholesalePrice: {
    //   type: Number,
    //   default: 0,
    // },
    // wholesaleProfit: {
    //   type: Number,
    //   default: 0,
    // },
    thumbnailImage: {
      type: String,
      required: true,
    },
    backViewImage: {
      type: String,
    },
    images: {
      type: [String],
    },
    sizeChartImage: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    status: {
      type: String,
    },
    slug: {
      type: String,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    brandRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "brand",
    },
    mainInventory: {
      type: Number,
      // required: true,
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
    },
    inventoryType: {
      type: String,
      enum: [
        "colorInventory",
        "levelInventory",
        "colorLevelInventory",
        "inventory",
      ],
    },
    inventoryRef: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "inventory",
      },
    ],
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
    },
    subCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
    childCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "childCategory",
    },
    subChildCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subChildCategory",
    },
  },
  { timestamps: true }
);

Productschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const ProductSchema = mongoose.model("product", Productschema);

module.exports = { ProductSchema };

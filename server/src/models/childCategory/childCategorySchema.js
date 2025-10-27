const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const ChildCategoryschema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    bannerImage: {
      type: String,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    viewType: {
      type: String,
      enum: ["top", "middle", "lowerMiddle", "buttom"],
    },
    subCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
  },
  { timestamps: true }
);

ChildCategoryschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const ChildCategorySchema = mongoose.model(
  "childCategory",
  ChildCategoryschema
);

module.exports = { ChildCategorySchema };

const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const SubChildCategoryschema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
    childCategoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "childCategory",
    },
  },
  { timestamps: true }
);

SubChildCategoryschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const SubChildCategorySchema = mongoose.model(
  "subChildCategory",
  SubChildCategoryschema
);

module.exports = { SubChildCategorySchema };

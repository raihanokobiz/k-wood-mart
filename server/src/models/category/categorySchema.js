const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const Categoryschema = new Schema(
  {
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    vectorImage: {
      type: String,
    },
    colorCode: {
      type: String,
    },
    slug: {
      type: String,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to generate slug
Categoryschema.pre("save", function (next) {
  if (this.name && (!this.slug || this.isModified("name"))) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const CategorySchema = mongoose.model("category", Categoryschema);

module.exports = { CategorySchema };

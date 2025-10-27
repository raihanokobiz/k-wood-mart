const mongoose = require("mongoose");
const slugify = require("slugify");

const Schema = mongoose.Schema;

const Brandschema = new Schema(
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
  },
  { timestamps: true }
);

// Generate slug
Brandschema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

const BrandSchema = mongoose.model("brand", Brandschema);

module.exports = { BrandSchema };

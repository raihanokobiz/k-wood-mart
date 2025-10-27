const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const Schema = mongoose.Schema;

const BlogTagschema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    slug: {
      type: String,
    },
  },
  { timestamps: true }
);

BlogTagschema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const BlogTagSchema = mongoose.model("blogTag", BlogTagschema);

module.exports = { BlogTagSchema };

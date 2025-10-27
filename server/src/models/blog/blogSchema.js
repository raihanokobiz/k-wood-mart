const mongoose = require("mongoose");
const { default: slugify } = require("slugify");
const Schema = mongoose.Schema;

const Blogschema = new Schema(
  {
    image:
      {
        type: String,
      },
    title: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
    },
    author: {
      type: String,
      trim: true,
    },
    details: {
      type: String,
      trim: true,
    },
    tags: [
      {
         type: String,
      },
    ],
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

Blogschema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const BlogSchema = mongoose.model("blog", Blogschema);

module.exports = { BlogSchema };

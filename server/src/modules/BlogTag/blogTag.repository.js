const { BlogTagSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class BlogTagRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createBlogTag(payload) {
    const newBlogTag = await this.#model.create(payload);
    return newBlogTag;
  }

  async getBlogTagWithPagination(payload) {
    try {
      const blogTags = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const blogTags = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalBlogTag = await this.#model.countDocuments();

          return { doc: blogTags, totalDoc: totalBlogTag };
        }
      );

      return blogTags;
    } catch (error) {
      console.error("Error getting blogTags with pagination:", error);
      throw error;
    }
  }
}

module.exports = new BlogTagRepository(BlogTagSchema);

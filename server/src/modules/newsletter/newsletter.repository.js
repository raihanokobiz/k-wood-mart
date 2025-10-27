const { NewsletterSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");



class NewsletterRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createNewsletter(payload) {
    const newNewsletter = await this.#model.create(payload);
    return newNewsletter;
  }

  async getNewsletterWithPagination(payload) {
    try {
      const newsletters = await pagination(payload, async (limit, offset, sortOrder) => {
        const newsletters = await this.#model.find({
        })
          .sort({ createdAt: sortOrder, })
          .skip(offset)
          .limit(limit)
        // .populate('') 
        // .populate('') 
        const totalNewsletter = await this.#model.countDocuments();

        return { doc: newsletters, totalDoc: totalNewsletter };
      });

      return newsletters;
    } catch (error) {
      console.error("Error getting newsletters with pagination:", error);
      throw error;
    }
  }

  async getNewsletterWithPagination(payload) {
    try {
      const newsletters = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const newsletters = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalNewsletter = await this.#model.countDocuments();

          return { doc: newsletters, totalDoc: totalNewsletter };
        }
      );

      return newsletters;
    } catch (error) {
      console.error("Error getting newsletters with pagination:", error);
      throw error;
    }
  }
}

module.exports = new NewsletterRepository(NewsletterSchema);


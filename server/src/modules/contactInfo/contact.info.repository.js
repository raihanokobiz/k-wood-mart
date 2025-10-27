const { ContactInfoSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class ContactInfoRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createContactInfo(payload) {
    const newContactInfo = await this.#model.create(payload);
    return newContactInfo;
  }

  async updateContactInfo(id, payload) {
    const updatedContactInfo = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedContactInfo) {
      throw new Error("About Us not found");
    }
    return updatedContactInfo;
  }

  async getContactInfoWithPagination(payload) {
    try {
      const contactInfos = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const contactInfos = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalContactInfo = await this.#model.countDocuments();

          return { doc: contactInfos, totalDoc: totalContactInfo };
        }
      );

      return contactInfos;
    } catch (error) {
      console.error("Error getting contactInfos with pagination:", error);
      throw error;
    }
  }
}

module.exports = new ContactInfoRepository(ContactInfoSchema);

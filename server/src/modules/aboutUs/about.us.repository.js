// const { AboutUsSchema } = require("../../models/index.js");
const { AboutUsSchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class AboutUsRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createAboutUs(payload, session) {
    // const existingAboutUs = await this.#model
    //   .find({}, null, { session })
    //   .sort({ createdAt: -1 });
    // const deleteResult = await this.#model.deleteMany({}, { session });
    // if (deleteResult.deletedCount > 0) {
    //   for (const aboutUs of existingAboutUs) {
    //     if (aboutUs.image) {
    //       try {
    //         await removeUploadFile(aboutUs.image);
    //       } catch (fileError) {
    //         console.error(`Failed to remove file: ${aboutUs.image}`, fileError);
    //       }
    //     }
    //   }
    // }

    const newAboutUs = await this.#model.create([payload], { session });
    return newAboutUs;
  }

  async updateAboutUs(id, payload) {
    const updatedAboutUs = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedAboutUs) {
      throw new Error("About Us not found");
    }
    return updatedAboutUs;
  }

  async getAboutUsWithPagination(payload) {
    try {
      const aboutUss = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const aboutUss = await this.#model
            .find({})
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit);
          // .populate('')
          // .populate('')
          const totalAboutUs = await this.#model.countDocuments();

          return { doc: aboutUss, totalDoc: totalAboutUs };
        }
      );

      return aboutUss;
    } catch (error) {
      console.error("Error getting aboutUss with pagination:", error);
      throw error;
    }
  }
}

module.exports = new AboutUsRepository(AboutUsSchema);

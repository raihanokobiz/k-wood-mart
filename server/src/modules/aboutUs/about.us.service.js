const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const aboutUsRepository = require("./about.us.repository.js");
const { isMainThread } = require("worker_threads");
const { log } = require("console");
const {
  convertFileNameWithPdfExt,
} = require("../../middleware/upload/convertFileNameWithPdfExt.js");
const {
  convertFileNameWithWebpExt,
} = require("../../middleware/upload/convertFileNameWithWebpExt.js");
const { uploadWorker } = require("../../middleware/upload/uploadWorker.js");
const {
  convertImgArrayToObject,
} = require("../../middleware/upload/convertImgArrayToObject.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");

class AboutUsService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createAboutUs(payloadFiles, payload, session) {
    const { files } = payloadFiles;
    const { header, title, description, whatsApp, email } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // console.log("file", files);

    const images = await ImgUploader(files);
    for (const key in images) {
      payload[key] = images[key];
    }

    const aboutUsData = await this.#repository.createAboutUs(payload, session);
    return aboutUsData;
  }

  async getAllAboutUs() {
    return await this.#repository.findAll();
  }

  async getAboutUsWithPagination(payload) {
    const aboutUs = await this.#repository.getAboutUsWithPagination(payload);
    return aboutUs;
  }

  async getSingleAboutUs(id) {
    const aboutUsData = await this.#repository.findById(id);
    if (!aboutUsData) throw new NotFoundError("AboutUs Not Find");
    return aboutUsData;
  }

  async updateAboutUs(id, payloadFiles, payload) {
    const { files } = payloadFiles;
    const { header, title, description, whatsApp, email } = payload;

    console.log(files, "files from update about us");
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }

    // Update the database with the new data
    const aboutUsData = await this.#repository.updateAboutUs(id, payload);

    // Remove old files if they’re being replaced
    if (files.length && aboutUsData) {
      console.log("run thoids upload reload", aboutUsData?.image);
      await removeUploadFile(aboutUsData?.image);
    }

    return aboutUsData;
  }

  async deleteAboutUs(id) {
    const aboutUs = await this.#repository.findById(id);
    if (!aboutUs) throw new NotFoundError("AboutUs not found");
    const deletedAboutUs = await this.#repository.deleteById(id);
    console.log("aboutUs", aboutUs);
    if (deletedAboutUs) {
      await removeUploadFile(aboutUs?.image);
    }
    return deletedAboutUs;
  }
}

module.exports = new AboutUsService(aboutUsRepository, "aboutUs");

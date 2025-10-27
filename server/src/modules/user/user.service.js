const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const userRepository = require("./user.repository.js");
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
const { isMainThread } = require("worker_threads");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const { idGenerate } = require("../../utils/IdGenerator.js");

class UserService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createUser(payload, payloadFiles, session) {

    const { files } = payloadFiles;
    console.log("files", files);
    const {
      name,
      email,
      phone,
      password,
      address,
      city,
      state,
      role,
      isFistOrder,
      orderPlaced,
    } = payload;
    // if (!type) throw new Error("type is required");
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    payload.userId = await idGenerate("USE-", "userId", this.#repository);
    const userData = await this.#repository.createUser(payload);
    return userData;
  }

  async getAllUser() {
    return await this.#repository.findAll({ status: true });
  }

  async getUserWithPagination(payload) {
    const user = await this.#repository.getUserWithPagination(payload);
    return user;
  }

  async getSingleUser(id) {
    const userData = await this.#repository.findById(id);
    if (!userData) throw new NotFoundError("User Not Find");
    return userData;
  }

  async updateUser(id, payload, payloadFiles, session) {
    const { files } = payloadFiles;
    const { warehouseRef } = payload;

    const {
      name,
      email,
      phone,
      password,
      address,
      city,
      state,
      role,
      isFistOrder,
      orderPlaced,
    } = payload;
    if (files?.length) {
      const images = await ImgUploader(files);
      for (const key in images) {
        payload[key] = images[key];
      }
    }
    if (!warehouseRef || warehouseRef === "undefined") {
      delete payload.warehouseRef;
    }

    const userData = await this.#repository.updateById(id, payload);
    if (!userData) throw new NotFoundError("User Not Find");
    if (files?.length && userData?.image) {
      console.log("run thoids upload reload", userData?.image);
      await removeUploadFile(userData?.image);
    }
    return userData;
  }

  async deleteUser(id) {
    const user = await this.#repository.findById(id);
    if (!user) throw new NotFoundError("User not found");
    const deletedUser = await this.#repository.deleteById(id);
    if (deletedUser) {
      await removeUploadFile(user?.image);
    }
    return deletedUser;
  }
}

module.exports = new UserService(userRepository, "user");

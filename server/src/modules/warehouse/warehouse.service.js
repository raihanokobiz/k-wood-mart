const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const warehouseRepository = require("./warehouse.repository.js");
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

class WarehouseService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createWarehouse(payload, session) {
    const { name, location, manager, contact, } = payload;
    if (!name) throw new NotFoundError("Name is required");
    const warehouseData = await this.#repository.createWarehouse(
      payload,
      session
    );
    return warehouseData;
  }

  async getAllWarehouse() {
    return await this.#repository.findAll({}, ["managerRef"]);
    // return await this.#repository.getAllWarehouse();
  }

  async getWarehouseWithPagination(payload) {
    const warehouse = await this.#repository.getWarehouseWithPagination(payload);
    return warehouse;
  }

  async getSingleWarehouse(id) {
    const warehouseData = await this.#repository.findById(id, ["managerRef"]);
    if (!warehouseData) throw new NotFoundError("Warehouse Not Find");
    return warehouseData;
  }

  async updateWarehouse(id, payload) {
    const { name, location, manager, contact, } = payload;
    if (!name) throw new NotFoundError("Name is required");
    const warehouseData = await this.#repository.updateWarehouse(id, payload);
    return warehouseData;
  }

  async updateWarehouseStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const warehouse = await this.#repository.updateWarehouseStatus(id, {
      status: status,
    });
    console.log("warehouse", warehouse);
    if (!warehouse) throw new NotFoundError("Warehouse not found");
    return warehouse;
  }

  async deleteWarehouse(id) {
    const warehouse = await this.#repository.findById(id);
    if (!warehouse) throw new NotFoundError("Warehouse not found");
    const deletedWarehouse = await this.#repository.deleteById(id);
    return deletedWarehouse;
  }
}

module.exports = new WarehouseService(warehouseRepository, "warehouse");

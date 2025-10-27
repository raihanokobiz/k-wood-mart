const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const inventoryRepository = require("./inventory.repository.js");
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
const productRepository = require("../product/product.repository.js");
const { idGenerate } = require("../../utils/IdGenerator.js");

class InventoryService extends BaseService {
  #repository;
  #productRepository;
  constructor(repository, productRepository, serviceName) {
    super(repository, productRepository, serviceName);
    this.#repository = repository;
    this.#productRepository = productRepository;
  }

  async createInventory(payload, session) {
    const { name,
      quantity, level,
      color, productRef, warehouseRef } = payload
    //  productRef , warehouseRef, quantity is required
    if (!productRef || !quantity || !warehouseRef) {
      throw new Error("All fields are required");
    }
    const product = await this.#productRepository.findById(productRef);
    if (!product) throw new NotFoundError("Product Not Found");
    payload.availableQuantity = quantity;
    payload.inventoryID = await idGenerate('INV-', "inventoryID", this.#repository);
    // inventoryType
    if (quantity && !name && !color && !level) {
      payload.inventoryType = 'inventory';//
    } else if (quantity && name && color && level) {
      payload.inventoryType = 'colorLevelInventory';
    } else if (quantity && name && color && !level) {
      payload.inventoryType = 'colorInventory';
    } else if (quantity && !name & !color && level) {
      payload.inventoryType = 'levelInventory'; //
    }
    console.log(payload);
    const inventoryData = await this.#repository.createInventory(
      payload,
      session
    );
    console.log("inventory", inventoryData);
    if (inventoryData) {
      await this.#productRepository.addProductInventory(
        inventoryData[0]._id,
        productRef,
        session,
      );
    }
    return inventoryData;
  }

  async getAllInventory(payload) {
    return await this.#repository.getAllInventory(payload);
  }

  async getInventoryWithPagination(payload) {
    const inventory = await this.#repository.getInventoryWithPagination(
      payload
    );
    return inventory;
  }

  async getSingleInventory(id) {
    const inventoryData = await this.#repository.findById(id);
    if (!inventoryData) throw new NotFoundError("Inventory Not Find");
    return inventoryData;
  }

  async updateInventory(id, payload, session) {
    const { name, quantity, level, color, productRef, warehouseRef } = payload
    if (!productRef || !quantity || !warehouseRef) {
      throw new Error("All fields are required");
    }
    const product = await this.#productRepository.findById(productRef);
    if (!product) throw new NotFoundError("Product Not Found");
    // inventoryType
    if (quantity && !name && !color && !level) {
      payload.inventoryType = 'inventory';//
    } else if (quantity && name && color && level) {
      payload.inventoryType = 'colorLevelInventory';
    } else if (quantity && name && color && !level) {
      payload.inventoryType = 'colorInventory';
    } else if (quantity && !name & !color && level) {
      payload.inventoryType = 'levelInventory'; //
    }
    const inventoryData = await this.#repository.updateInventory(id, payload);
    return inventoryData;
  }

  async updateInventoryStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const inventory = await this.#repository.updateInventoryStatus(id, {
      status: status,
    });
    console.log("inventory", inventory);
    if (!inventory) throw new NotFoundError("Inventory not found");
    return inventory;
  }

  async deleteInventory(id, session) {
    const inventory = await this.#repository.findById(id);
    if (!inventory) throw new NotFoundError("Inventory not found");
    const deletedInventory = await this.#repository.deleteById(id, session);
    if (!deletedInventory) {
      throw new Error("Failed to delete inventory. Please try again.");
    }
    const productRef = inventory.productRef;
    await this.#productRepository.updateProductInventory(id, productRef, session);
    // await this.#productRepository.updateInventory(productRef, {
    //   $pull: { inventoryRef: id }, // Removes the deleted inventory ID
    // });
    // find the product by productId , than update the inventoryRef array to remove id 
    return deletedInventory;
  }

}

module.exports = new InventoryService(inventoryRepository, productRepository, "inventory");

const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const warehouseTransferRepository = require("./warehouse.transfer.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const inventoryRepository = require("../inventory/inventory.repository.js");
const productRepository = require("../product/product.repository.js");
const { idGenerate } = require("../../utils/IdGenerator.js");


class WarehouseTransferService extends BaseService {
  #repository;
  #inventoryRepository;
  #productRepository;
  constructor(repository, inventoryRepository, productRepository, serviceName) {
    super(repository, inventoryRepository, productRepository, serviceName);
    this.#repository = repository;
    this.#inventoryRepository = inventoryRepository;
    this.#productRepository = productRepository;
  }

  async createWarehouseTransfer(payload, session) {
    const { fromWarehouseRef, toWarehouseRef, inventoryRefs, quantitys } = payload;

    if (!fromWarehouseRef || !toWarehouseRef || !inventoryRefs || !quantitys) {
      throw new Error("All fields are required.");
    }

    if (!Array.isArray(inventoryRefs) || !Array.isArray(quantitys)) {
      throw new Error("Inventory items and quantities must be arrays.");
    }

    if (inventoryRefs.length !== quantitys.length) {
      throw new Error("Each inventory item must have a matching quantity.");
    }

    const warehouseTransfers = [];

    for (let i = 0; i < inventoryRefs.length; i++) {
      const transferPayload = {
        fromWarehouseRef,
        toWarehouseRef,
        inventoryRef: inventoryRefs[i],
        quantity: quantitys[i],
      };

      const warehouseTransferData = await this.#repository.createWarehouseTransfer(transferPayload, session);
      warehouseTransfers.push(warehouseTransferData);
    }

    return warehouseTransfers;
  }


  // async getAllWarehouseTransfer() {
  //   return await this.#repository.findAll({}, ["brandRef", "categoryRef", "subCategoryRef"]);
  // }

  async getWarehouseTransferFromWithPagination(idFrom, payload) {
    const warehouseTransfer = await this.#repository.getWarehouseTransferFromWithPagination(idFrom, payload);
    return warehouseTransfer;
  }
  async getWarehouseTransferToWithPagination(idTo, payload) {
    const warehouseTransfer = await this.#repository.getWarehouseTransferToWithPagination(idTo, payload);
    return warehouseTransfer;
  }

  // async getSingleWarehouseTransfer(id) {
  //   const warehouseTransferData = await this.#repository.findById(id);
  //   if (!warehouseTransferData) throw new NotFoundError("WarehouseTransfer Not Find");
  //   return warehouseTransferData;
  // }

  // async updateWarehouseTransfer(id, payload) {
  //   // const {
  //   //   code,
  //   //   discount,
  //   //   useLimit,
  //   //   used,
  //   //   startDate,
  //   //   expireDate,
  //   //   discountType,
  //   //   categoryRef,
  //   //   brandRef,
  //   //   subCategoryRef,
  //   // } = payload;
  //   const warehouseTransferData = await this.#repository.updateWarehouseTransfer(id, payload);

  //   return warehouseTransferData;
  // }

  async updateWarehouseTransferStatus(id, payload, session) {
    const { status, warehouseRef } = payload;
    if (!status && !warehouseRef) throw new NotFoundError("status and warehouse is requried");
    // find warehouse tranfar information 
    const warehouseTransfer = await this.#repository.findById(id);
    if (!warehouseTransfer) throw new NotFoundError("Warehouse not found");
    let warehouseTransferResult;
    if (warehouseTransfer?.fromWarehouseRef == warehouseRef) {
      // if status = Reject other satatus not allows
      if (status !== "Reject") {
        throw new Error("This transfer cannot be modified unless it is Rejected.");
      }
      // const inventory = await this.#inventoryRepository.findInventoryByWarehous(warehouseTransfer.inventoryRef, warehouseTransfer?.fromWarehouseRef );
      // if (!inventory) throw new NotFoundError("Inventory not found");
      // if status = Reject and warehouse is same then update status = Reject

      warehouseTransferResult = await this.#repository.updateWarehouseTransfer(id, { status });

    }
    if (warehouseTransfer?.toWarehouseRef == warehouseRef) {
      if (warehouseTransfer?.status == "Reject") {
        throw new Error("This transfer cannot be modified, it is Rejected.");
      }
      // if status = Reject other satatus not allows
      if (status !== "Reject" && status !== "Completed") {
        throw new Error("This transfer cannot be modified unless it is Rejected or Completed.");
      }
      if (status == "Reject") {
        warehouseTransferResult = await this.#repository.updateWarehouseTransfer(id, { status });
        return;
      };
      if (status == "Completed") {
        const inventory = await this.#inventoryRepository.findById(warehouseTransfer?.inventoryRef)
        if (!inventory) throw new NotFoundError("Inventory not found");
        console.log('=========INVENTORY', inventory)
        const product = await this.#productRepository.findById(inventory?.productRef);
        console.log('=========inventory?.productRef', inventory?.productRef)
        console.log('=========product ', product)
        // product creted //
        let productPayload;
        if (product?.warehouseRef !== warehouseTransfer?.toWarehouseRef) {
          const newProductId = await idGenerate("PRO-", "productId", this.#productRepository)
          // create new product look like product but warehouseRef make warehouseTransfer?.toWarehouseRef and add warehouse
          productPayload = {
            productId: newProductId,
            name: product.name,
            description: product.description,
            discountType: product.discountType,
            discount: product.discount,
            discountAmount: product.discountAmount,
            price: product.price,
            mrpPrice: product.mrpPrice,
            warehousePrice: product.warehousePrice,
            warehouseProfit: product.warehouseProfit,
            wholesalePrice: product.wholesalePrice,
            wholesaleProfit: product.wholesaleProfit,
            thumbnailImage: product.thumbnailImage,
            backViewImage: product.backViewImage,
            images: product.images,
            videoUrl: product.videoUrl,
            freeShipping: product.freeShipping,
            brandRef: product.brandRef,
            // mainInventory: inventory.stock, // Assign transferred stock
            warehouseRef: warehouseTransfer.toWarehouseRef, // Assign new warehouse
            categoryRef: product.categoryRef,
            subCategoryRef: product.subCategoryRef,
            childCategoryRef: product.childCategoryRef,
            subChildCategoryRef: product.subChildCategoryRef,
          }
        }
        console.log("------------productPayload", session)

        const newProduct = await this.#productRepository.createProduct(productPayload, session);
        console.log("------------1")
        // inventory crete //
        const newInventoryID = await idGenerate('INV-', "inventoryID", this.#inventoryRepository);
        const inventoryPayload = {
          productRef: newProduct[0]?._id,
          warehouseRef: warehouseTransfer.toWarehouseRef,
          quantity: warehouseTransfer.quantity,
          availableQuantity: warehouseTransfer.quantity,

          inventoryType: inventory?.inventoryType,
          color: inventory?.color,
          name: inventory?.name,
          level: inventory?.level,
          inventoryID: newInventoryID
        }
        console.log("------------2")
        const newInventory = await this.#inventoryRepository.createInventory(inventoryPayload, session);
        if (newInventory) {
          await this.#productRepository.addProductInventory(
            newInventory[0]._id,
            newProduct[0]?._id,
            session,
          );
        }
        console.log("------------3")
        //send warehousr inventory quantity dicrices //
        const newQuantity = inventory?.quantity - warehouseTransfer?.quantity
        const newAvailableQuantity = inventory?.availableQuantity - warehouseTransfer?.quantity
        await this.#inventoryRepository.updateById(warehouseTransfer?.inventoryRef, { quantity: newQuantity, availableQuantity: newAvailableQuantity }, session);
        console.log("------------4")
        warehouseTransferResult = await this.#repository.updateWarehouseTransfer(id, { status });

      }
    }
    // update warehouse transfer
    // status = status === "true";
    // const warehouseTransfer = await this.#repository.updateWarehouseTransferStatus(id, {
    //   status: status,
    // });
    // console.log("warehouseTransfer", warehouseTransfer);
    // if (!warehouseTransfer) throw new NotFoundError("WarehouseTransfer not found");
    return warehouseTransferResult;
  }

  // async deleteWarehouseTransfer(id) {
  //   const warehouseTransfer = await this.#repository.findById(id);
  //   if (!warehouseTransfer) throw new NotFoundError("WarehouseTransfer not found");
  //   const deletedWarehouseTransfer = await this.#repository.deleteById(id);
  //   console.log("warehouseTransfer", warehouseTransfer);
  //   if (deletedWarehouseTransfer) {
  //     await removeUploadFile(warehouseTransfer?.image);
  //   }
  //   return deletedWarehouseTransfer;
  // }

  // async calculateWarehouseTransferTotal(payload, session) {
  //   const calculationResult = await this.#repository.calculateWarehouseTransferTotal(
  //     payload,
  //     session
  //   );
  //   return calculationResult;
  // }
}

module.exports = new WarehouseTransferService(warehouseTransferRepository, inventoryRepository, productRepository, "warehouseTransfer");

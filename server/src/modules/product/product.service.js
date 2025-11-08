const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const productRepository = require("./product.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");
const inventoryRepository = require("../inventory/inventory.repository.js");
const { calculateDiscountAmount } = require("../../utils/calculation.js");
const ImgUploader = require("../../middleware/upload/ImgUploder.js");
const { default: mongoose } = require("mongoose");
const { idGenerate } = require("../../utils/IdGenerator.js");
const { generateEAN13Barcode } = require("../../utils/barcodeGenerate.js");
const subCategoryRepository = require("../subCategory/sub.category.repository.js");
const categoryRepository = require("../category/category.repository.js");

class ProductService extends BaseService {
  #repository;
  #inventoryRepository;
  #categoryRepository;
  #subCategoryRepository;
  constructor(
    repository,
    inventoryRepository,
    categoryRepository,
    subCategoryRepository,
    serviceName
  ) {
    super(
      repository,
      inventoryRepository,
      categoryRepository,
      subCategoryRepository,
      serviceName
    );
    this.#repository = repository;
    this.#inventoryRepository = inventoryRepository;
    this.#categoryRepository = categoryRepository;
    this.#subCategoryRepository = subCategoryRepository;
  }

  async createProduct(payloadFiles, payload, session) {
    console.log("Payload", payload);

    const { files } = payloadFiles;
    const {
      // name,
      // description,
      barcode,
      mrpPrice,
      discountType,
      discount,
      inventoryType,
      inventory,
      inventoryArray,
      // videoUrl,
      // freeShipping,
      // brandRef,
      // categoryRef,
      // subCategoryRef,
      inventorys,
    } = payload;
    let inventoryIds = [];
    let totalInventoryCount = 0;
    let maxPrice = 10000;
    payload.inventoryType = inventoryType;
    // activeTabName == 'colorInventory' || activeTabName == "levelInventory" || activeTabName == "colorLevelInventory")

    if (discountType && discount) {
      payload.isDiscounted = true;
      payload.discountType = discountType;
      payload.discount = discount;
    }
    console.log("payload.isDiscounted", payload.isDiscounted);
    // ll
    // else {
    //   payload.price = mrpPrice;
    // }
    if (inventoryType == "colorInventory") {
      console.log("inventory====", inventory);
      let inventoryTotal = 0;
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const color = item.colorCode || "#000000";
        const name = item.color || "Unknown";
        const quantity = parseInt(item.quantity) || 0;
        const mrpPrice = Number(item.mrpPrice);
        inventoryTotal += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            "INV-",
            "inventoryID",
            this.#inventoryRepository
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory = {
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          color,
          name,
          barcode: item.barcode || generateEAN13Barcode(),
          inventoryID: newInventoryId,
          mrpPrice: mrpPrice,
        };
        if ((discountType, discount)) {
          const { price, discountAmount } = calculateDiscountAmount(
            mrpPrice,
            discountType,
            discount
          );
          newInventory.price = price;
          newInventory.discountAmount = discountAmount;
          newInventory.discountType = discountType;
        } else {
          newInventory.price = mrpPrice;
        }
        maxPrice =
          newInventory?.price && Math.min(maxPrice, newInventory?.price);
        const createNewInventory = await this.#inventoryRepository.create(
          newInventory,
          session
        );
        inventoryIds.push(createNewInventory[0]._id);
      }
    } else if (inventoryType == "levelInventory") {
      let inventoryTotal = 0;
      let newInventoryId = "";
      for (const item of inventoryArray) {
        const level = item.level || "Unknown";
        const quantity = Number(item.quantity) || 0;
        const mrpPrice = Number(item.mrpPrice);
        inventoryTotal += quantity;
        const title = "INV-";
        if (newInventoryId === "") {
          newInventoryId = await idGenerate(
            title,
            "newInventoryId",
            this.#inventoryRepository
          );
        } else {
          let id = Number(newInventoryId.slice(title.length + 6)) + 1;
          let prefix = newInventoryId.slice(0, title.length + 6);
          newInventoryId = prefix + id;
        }
        const newInventory = {
          level: level,
          barcode: item.barcode || generateEAN13Barcode(),
          quantity: quantity,
          availableQuantity: quantity,
          inventoryType: inventoryType,
          // quantity: inventoryTotal,
          inventoryID: newInventoryId,
          mrpPrice: mrpPrice,
        };
        if ((discountType, discount)) {
          const { price, discountAmount } = calculateDiscountAmount(
            mrpPrice,
            discountType,
            discount
          );
          newInventory.price = price;
          newInventory.discountAmount = discountAmount;
          newInventory.discountType = discountType;
        } else {
          newInventory.price = mrpPrice;
        }
        maxPrice =
          newInventory?.price && Math.min(maxPrice, newInventory?.price);
        const createNewInventory = await this.#inventoryRepository.create(
          newInventory,
          session
        );
        inventoryIds.push(createNewInventory[0]._id);
      }
    } else if (inventoryType == "colorLevelInventory") {
      let newInventoryID = "";
      console.log("inventory color level====", inventoryArray[0].colorLevel);

      for (const item of inventoryArray) {
        console.log("inventory color level", item);
        // ll
        const level = item.level || "Unknown";
        const variants = item.colorLevel;
        const title = "INV-";
        for (const item of variants) {
          if (newInventoryID === "") {
            newInventoryID = await idGenerate(
              title,
              "inventoryID",
              this.#inventoryRepository
            );
          } else {
            let id = Number(newInventoryID.slice(title.length + 6)) + 1;
            let prefix = newInventoryID.slice(0, title.length + 6);
            newInventoryID = prefix + id;
          }
          const newInventory = {
            quantity: item.quantity,
            availableQuantity: item.quantity,
            color: item.colorCode || "#000000",
            name: item.color || "Unknown",
            level: level,
            barcode: item.barcode || generateEAN13Barcode(),
            inventoryID: newInventoryID,
            mrpPrice: item.mrpPrice,
            inventoryType: inventoryType,
          };
          if ((discountType, discount)) {
            const { price, discountAmount } = calculateDiscountAmount(
              Number(item.mrpPrice),
              discountType,
              discount
            );
            newInventory.price = price;
            newInventory.discountAmount = discountAmount;
            newInventory.discountType = discountType;
          } else {
            newInventory.price = item.mrpPrice;
          }
          maxPrice =
            newInventory?.price && Math.min(maxPrice, newInventory?.price);
          const createNewInventory = await this.#inventoryRepository.create(
            newInventory,
            session
          );
          inventoryIds.push(createNewInventory[0]._id);
        }
      }
    } else {
      payload.inventoryType = "inventory";
      const newInventoryID = await idGenerate(
        "INV-",
        "inventoryID",
        this.#inventoryRepository
      );
      // "barcode":"","mrpPrice":"43"
      const newInventory = {
        quantity: inventoryArray[0]?.quantity || 0,
        mrpPrice: inventoryArray[0]?.mrpPrice,
        barcode: inventoryArray[0]?.barcode || generateEAN13Barcode(),
        availableQuantity: inventoryArray[0]?.quantity || 0,
        inventoryType: inventoryType,
        inventoryID: newInventoryID,
      };
      if ((discountType, discount)) {
        const { price, discountAmount } = calculateDiscountAmount(
          Number(inventoryArray[0]?.mrpPrice),
          discountType,
          discount
        );
        newInventory.price = price;
        newInventory.discountAmount = discountAmount;
        newInventory.discountType = discountType;
      } else {
        newInventory.price = inventoryArray[0]?.mrpPrice;
      }
      maxPrice = newInventory?.price;
      const createNewInventory = await this.#inventoryRepository.create(
        newInventory,
        session
      );
      // console.log("createNewInventory", createNewInventory)
      inventoryIds.push(createNewInventory[0]._id);
    }

    payload.mainInventory = totalInventoryCount;
    payload.inventoryRef = inventoryIds;

    payload.featured = payload.featured || false;

    if (!files?.length) {
      throw new Error("Thumbnail Image is required");
    }
    const hasThumbnailImage = files.some(
      (file) => file.fieldname === "thumbnailImage"
    );

    if (!hasThumbnailImage) {
      throw new Error("Thumbnail Image is required");
    }
    let images = await ImgUploader(files);

    // images.images = Object.keys(images)
    //   .filter((key) => key.startsWith("images["))
    //   .map((key) => images[key]),

    for (const key in images) {
      payload[key] = images[key];
    }

    payload.productId = await idGenerate("PRO-", "productId", this.#repository);
    payload.price = maxPrice;

    const productData = await this.#repository.createProduct(payload, session);
    if (productData) {
      for (const invenoryId of inventoryIds) {
        const data = await this.#inventoryRepository.updateById(
          invenoryId,
          { productRef: productData[0]._id },
          session
        );
      }
    }
    return productData;
  }

  async getAllProduct(payload) {
    const { warehouseRef } = payload;
    let query = {};
    if (warehouseRef) {
      query.warehouseRef = warehouseRef;
    }

    console.log("Get all products", warehouseRef);
    return await this.#repository.findAll(query, [
      "brandRef",
      "categoryRef",
      "subCategoryRef",
      "inventoryRef",
    ]);
  }

  async getNewArrivalsProduct() {
    try {
      const allProducts = await this.#repository.findAll({}, ["categoryRef"]);

      // Furniture products filter
      const furnitureProducts = allProducts
        .filter((p) => p.categoryRef?.name?.toLowerCase() === "furniture")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

      // Curtains products filter
      const curtainsProducts = allProducts
        .filter((p) => p.categoryRef?.name?.toLowerCase() === "curtains")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);

      const newArrivals = [...furnitureProducts, ...curtainsProducts];

      return { product: newArrivals };
    } catch (error) {
      console.error("Get New Arrivals Error:", error);
      throw error;
    }
  }

  async getAllBestSellProduct(payload) {
    const product = await this.#repository.getAllBestSellProduct(payload);
    return { product };
  }

  async getAllDiscountedProduct(payload) {
    const product = await this.#repository.getAllDiscountedProduct(payload);
    return { product };
  }

  async getAllProductByBrandOrGender(payload) {
    const { brandRef } = payload;

    const filter = {};

    if (brandRef) {
      filter.brandRef = brandRef;
    }

    const products = await this.#repository.findAll(filter);
    console.log(products, "products from brand gender service");

    return { products };
  }

  async getAllProductForHomePage() {
    const product = await this.#repository.getAllProductForHomePage();
    return { product };
  }

  async getRelatedProduct(payload) {
    const product = await this.#repository.getRelatedProduct(payload);
    return product;
  }

  async getSearchProduct(payload) {
    const product = await this.#repository.getSearchProduct(payload);
    return product;
  }

  async getProductWithPagination(payload) {
    const product = await this.#repository.getProductWithPagination(payload);
    return product;
  }

  async getProductWithPaginationForAdmin(payload) {
    const product = await this.#repository.getProductWithPaginationForAdmin(
      payload
    );
    return product;
  }

  async getSingleProduct(slug) {
    const productData = await this.#repository.findBySlug(slug, [
      "brandRef",
      "categoryRef",
      "subCategoryRef",
      "childCategoryRef",
      "subChildCategoryRef",
      "inventoryRef",
    ]);
    if (!productData) throw new NotFoundError("Product Not Find");
    return productData;
  }

  async updateProduct(id, payloadFiles, payload, session) {
    try {
      console.log("update service", payload);

      const { files } = payloadFiles;
      const {
        name,
        barcode,
        mrpPrice,
        discountType,
        discount,
        inventoryType,
        inventory,
        inventoryArray,
        featured,
      } = payload;

      const existingProduct = await this.#repository.findById(id);
      if (!existingProduct) throw new Error("Product not found");

      let inventoryIds = [];
      let totalInventoryCount = 0;
      let maxPrice = 10000;
      payload.inventoryType = inventoryType;
      payload.isDiscounted = false;
      if (featured !== undefined) {
        payload.featured = featured;
      }
      if (discountType && discount) {
        payload.isDiscounted = true;
        payload.discountType = discountType;
        payload.discount = discount;
      }
      if (inventoryType == "colorInventory") {
        console.log("inventoryArray====", inventoryArray);
        let inventoryTotal = 0;
        let newInventoryId = "";
        for (const item of inventoryArray) {
          const inventoryExits = item.id
            ? await this.#inventoryRepository.findById(item.id)
            : null;
          console.log("inventoryExits =====================", inventoryExits);
          if (inventoryExits) {
            const color = item.colorCode || "#000000";
            const name = item.color || "Unknown";
            const quantity = parseInt(item.quantity) || 0;
            const mrpPrice = Number(item.mrpPrice);
            inventoryTotal += quantity;
            const title = "INV-";
            if (newInventoryId === "") {
              newInventoryId = await idGenerate(
                "INV-",
                "inventoryID",
                this.#inventoryRepository
              );
            } else {
              let id = Number(newInventoryId.slice(title.length + 6)) + 1;
              let prefix = newInventoryId.slice(0, title.length + 6);
              newInventoryId = prefix + id;
            }
            const updatedInventory = {
              quantity: quantity,
              availableQuantity: quantity,
              inventoryType: inventoryType,
              color,
              name,
              barcode: item.barcode || generateEAN13Barcode(),
              inventoryID: newInventoryId,
              mrpPrice: mrpPrice,
            };
            if ((discountType, discount)) {
              const { price, discountAmount } = calculateDiscountAmount(
                mrpPrice,
                discountType,
                discount
              );
              updatedInventory.price = price;
              updatedInventory.discountAmount = discountAmount;
              updatedInventory.discountType = discountType;
            } else {
              updatedInventory.price = mrpPrice;
            }
            maxPrice =
              updatedInventory?.price &&
              Math.min(maxPrice, updatedInventory?.price);
            await this.#inventoryRepository.updateById(
              item.id,
              updatedInventory,
              session
            );
            inventoryIds.push(item.id);
          } else {
            const color = item.colorCode || "#000000";
            const name = item.color || "Unknown";
            const quantity = parseInt(item.quantity) || 0;
            const mrpPrice = Number(item.mrpPrice);
            inventoryTotal += quantity;
            const title = "INV-";
            if (newInventoryId === "") {
              newInventoryId = await idGenerate(
                "INV-",
                "inventoryID",
                this.#inventoryRepository
              );
            } else {
              let id = Number(newInventoryId.slice(title.length + 6)) + 1;
              let prefix = newInventoryId.slice(0, title.length + 6);
              newInventoryId = prefix + id;
            }
            const newInventory = {
              quantity: quantity,
              availableQuantity: quantity,
              inventoryType: inventoryType,
              color,
              name,
              barcode: item.barcode || generateEAN13Barcode(),
              inventoryID: newInventoryId,
              mrpPrice: mrpPrice,
            };
            if ((discountType, discount)) {
              const { price, discountAmount } = calculateDiscountAmount(
                mrpPrice,
                discountType,
                discount
              );
              newInventory.price = price;
              newInventory.discountAmount = discountAmount;
              newInventory.discountType = discountType;
            } else {
              newInventory.price = mrpPrice;
            }
            maxPrice =
              newInventory?.price && Math.min(maxPrice, newInventory?.price);
            const createNewInventory = await this.#inventoryRepository.create(
              newInventory,
              session
            );
            inventoryIds.push(createNewInventory[0]._id);
          }
        }
      } else if (inventoryType == "levelInventory") {
        let inventoryTotal = 0;
        let newInventoryId = "";
        for (const item of inventoryArray) {
          const inventoryExits = item.id
            ? await this.#inventoryRepository.findById(item.id)
            : null;
          console.log("inventoryExits =====================", inventoryExits);
          if (inventoryExits) {
            const level = item.level || "Unknown";
            const quantity = Number(item.quantity) || 0;
            const mrpPrice = Number(item.mrpPrice);
            inventoryTotal += quantity;
            const title = "INV-";
            if (newInventoryId === "") {
              newInventoryId = await idGenerate(
                title,
                "newInventoryId",
                this.#inventoryRepository
              );
            } else {
              let id = Number(newInventoryId.slice(title.length + 6)) + 1;
              let prefix = newInventoryId.slice(0, title.length + 6);
              newInventoryId = prefix + id;
            }
            const updatedInventory = {
              level: level,
              barcode: item.barcode || generateEAN13Barcode(),
              quantity: quantity,
              availableQuantity: quantity,
              inventoryType: inventoryType,
              color: "",
              name: "",
              // quantity: inventoryTotal,
              inventoryID: newInventoryId,
              mrpPrice: mrpPrice,
            };
            if ((discountType, discount)) {
              const { price, discountAmount } = calculateDiscountAmount(
                mrpPrice,
                discountType,
                discount
              );
              updatedInventory.price = price;
              updatedInventory.discountAmount = discountAmount;
              updatedInventory.discountType = discountType;
            } else {
              updatedInventory.price = mrpPrice;
            }
            maxPrice =
              updatedInventory?.price &&
              Math.min(maxPrice, updatedInventory?.price);
            await this.#inventoryRepository.updateById(
              item.id,
              updatedInventory,
              session
            );
            inventoryIds.push(item.id);
          } else {
            const level = item.level || "Unknown";
            const quantity = Number(item.quantity) || 0;
            const mrpPrice = Number(item.mrpPrice);
            inventoryTotal += quantity;
            const title = "INV-";
            if (newInventoryId === "") {
              newInventoryId = await idGenerate(
                title,
                "newInventoryId",
                this.#inventoryRepository
              );
            } else {
              let id = Number(newInventoryId.slice(title.length + 6)) + 1;
              let prefix = newInventoryId.slice(0, title.length + 6);
              newInventoryId = prefix + id;
            }
            const newInventory = {
              level: level,
              barcode: item.barcode || generateEAN13Barcode(),
              quantity: quantity,
              availableQuantity: quantity,
              inventoryType: inventoryType,
              // quantity: inventoryTotal,
              inventoryID: newInventoryId,
              mrpPrice: mrpPrice,
            };
            if ((discountType, discount)) {
              const { price, discountAmount } = calculateDiscountAmount(
                mrpPrice,
                discountType,
                discount
              );
              newInventory.price = price;
              newInventory.discountAmount = discountAmount;
              newInventory.discountType = discountType;
            } else {
              newInventory.price = mrpPrice;
            }
            maxPrice =
              newInventory?.price && Math.min(maxPrice, newInventory?.price);
            const createNewInventory = await this.#inventoryRepository.create(
              newInventory,
              session
            );
            inventoryIds.push(createNewInventory[0]._id);
          }
        }
      } else if (inventoryType == "colorLevelInventory") {
        console.log("inventory color level====", inventoryArray);
        // ll
        let inventoryTotal = 0;
        let newInventoryID = "";
        for (const item of inventoryArray) {
          // console.log('inventory color level', item)
          const level = item.level || "Unknown";
          const variants = item.colorLevel;
          const title = "INV-";

          for (const item of variants) {
            const inventoryExits = item.id
              ? await this.#inventoryRepository.findById(item.id)
              : null;
            console.log("inventoryExits =====================", inventoryExits);
            if (inventoryExits) {
              if (newInventoryID === "") {
                newInventoryID = await idGenerate(
                  title,
                  "inventoryID",
                  this.#inventoryRepository
                );
              } else {
                let id = Number(newInventoryID.slice(title.length + 6)) + 1;
                let prefix = newInventoryID.slice(0, title.length + 6);
                newInventoryID = prefix + id;
              }
              const updatedInventory = {
                quantity: item.quantity,
                availableQuantity: item.quantity,
                color: item.colorCode || "#000000",
                name: item.color || "Unknown",
                level: level,
                barcode: item.barcode || generateEAN13Barcode(),
                inventoryID: newInventoryID,
                mrpPrice: item.mrpPrice,
                inventoryType: inventoryType,
              };
              if ((discountType, discount)) {
                const { price, discountAmount } = calculateDiscountAmount(
                  Number(item.mrpPrice),
                  discountType,
                  discount
                );
                updatedInventory.price = price;
                updatedInventory.discountAmount = discountAmount;
                updatedInventory.discountType = discountType;
              } else {
                updatedInventory.price = Number(item.mrpPrice);
              }
              maxPrice =
                updatedInventory?.price &&
                Math.min(maxPrice, updatedInventory?.price);
              await this.#inventoryRepository.updateById(
                item.id,
                updatedInventory,
                session
              );
              inventoryIds.push(item.id);
            } else {
              if (newInventoryID === "") {
                newInventoryID = await idGenerate(
                  title,
                  "inventoryID",
                  this.#inventoryRepository
                );
              } else {
                let id = Number(newInventoryID.slice(title.length + 6)) + 1;
                let prefix = newInventoryID.slice(0, title.length + 6);
                newInventoryID = prefix + id;
              }
              const newInventory = {
                quantity: item.quantity,
                availableQuantity: item.quantity,
                color: item.colorCode || "#000000",
                name: item.color || "Unknown",
                level: level,
                barcode: item.barcode || generateEAN13Barcode(),
                inventoryID: newInventoryID,
                mrpPrice: item.mrpPrice,
                inventoryType: inventoryType,
              };
              if ((discountType, discount)) {
                const { price, discountAmount } = calculateDiscountAmount(
                  Number(item.mrpPrice),
                  discountType,
                  discount
                );
                newInventory.price = price;
                newInventory.discountAmount = discountAmount;
                newInventory.discountType = discountType;
              } else {
                newInventory.price = Number(item.mrpPrice);
              }
              maxPrice =
                newInventory?.price && Math.min(maxPrice, newInventory?.price);
              const createNewInventory = await this.#inventoryRepository.create(
                newInventory,
                session
              );
              inventoryIds.push(createNewInventory[0]._id);
            }
          }
        }
      } else {
        const inventoryRef = inventoryArray[0].id;
        payload.inventoryType = "inventory";
        const newInventoryID = await idGenerate(
          "INV-",
          "inventoryID",
          this.#inventoryRepository
        );
        const updatedInventory = {
          quantity: inventoryArray[0]?.quantity || 0,
          mrpPrice: inventoryArray[0]?.mrpPrice,
          barcode: inventoryArray[0]?.barcode || generateEAN13Barcode(),
          availableQuantity: inventoryArray[0]?.quantity || 0,
          inventoryType: inventoryType,
          inventoryID: newInventoryID,
        };
        if ((discountType, discount)) {
          const { price, discountAmount } = calculateDiscountAmount(
            Number(inventoryArray[0]?.mrpPrice),
            discountType,
            discount
          );
          updatedInventory.price = price;
          updatedInventory.discountAmount = discountAmount;
          updatedInventory.discountType = discountType;
        } else {
          updatedInventory.price = inventoryArray[0]?.mrpPrice;
        }
        maxPrice = updatedInventory?.price;
        await this.#inventoryRepository.updateById(
          inventoryRef,
          updatedInventory,
          session
        );
        inventoryIds.push(inventoryRef);
      }

      // Set inventory refs
      console.log("inventoryIds", inventoryIds);
      // ll
      payload.inventoryRef = inventoryIds;
      payload.mainInventory = totalInventoryCount;

      // Upload and update images
      if (files?.length) {
        const images = await ImgUploader(files);
        for (const key in images) {
          payload[key] = images[key];
        }
      }
      payload.maxPrice = maxPrice;

      const productData = await this.#repository.updateProduct(
        id,
        payload,
        session
      );

      // Link inventory to product
      if (productData && inventoryIds.length) {
        const productId = productData._id || productData[0]?._id;
        if (!productId)
          throw new Error("Failed to get product ID from update result");

        for (const inventoryId of inventoryIds) {
          await this.#inventoryRepository.updateById(
            inventoryId,
            { productRef: productId },
            session
          );
        }
      }

      // if (productData) {
      //   for (const invenoryId of inventoryIds) {
      //     const data = await this.#inventoryRepository.updateById(
      //       invenoryId,
      //       { productRef: productData[0]._id },
      //       session
      //     );
      //   }
      // }

      return productData;
    } catch (error) {
      console.error("Update Product Error:", error);
      throw error;
    }
  }

  async updateProductStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const product = await this.#repository.updateProductStatus(id, {
      status: status,
    });
    console.log("product", product);
    if (!product) throw new NotFoundError("Product not found");
    return product;
  }

  async deleteProduct(id, session) {
    console.log(id, "product ID from service>>>>>>>>>>>>");
    const product = await this.#repository.findById(id);
    if (!product) throw new NotFoundError("Product not found");
    const deletedProduct = await this.#repository.deleteById(id, session);
    // inventoryRepository dete product?.inventoryRef
    if (product?.inventoryRef) {
      for (const inventoryRef of product.inventoryRef) {
        const data = await this.#inventoryRepository.deleteById(
          inventoryRef,
          session
        );
      }
    }
    if (deletedProduct) {
      if (deletedProduct?.thumbnailImage) {
        await removeUploadFile(product?.thumbnailImage);
      }
      if (deletedProduct?.backViewImage) {
        await removeUploadFile(product?.backViewImage);
      }
      if (Array.isArray(deletedProduct?.images)) {
        deletedProduct?.images.forEach(async (image) => {
          await removeUploadFile(image);
        });
      }
    }

    return deletedProduct;
  }

  async getCategoriesWithSubcategoriesAndCounts() {
    const categories =
      await this.#repository.getCategoriesWithSubcategoriesAndCounts();
    return categories;
  }
}

module.exports = new ProductService(
  productRepository,
  inventoryRepository,
  categoryRepository,
  subCategoryRepository,
  "product"
);

// const { InventorySchema } = require("../../models/index.js");
const { InventorySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class InventoryRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createInventory(payload, session) {
    const newInventory = await this.#model.create([payload], { session });
    return newInventory;
  }
  async getAllInventory(payload) {
    const { warehouseRef } = payload;
    const inventorys = await this.#model.find({ warehouseRef: warehouseRef }).populate([
      { path: 'productRef' },
    ]);;
    // const inventorys = await this.#model.aggregate([
    //   { $unwind: "$variants" }, // Unwind variants array
    //   { $unwind: "$variants.levelOptions" }, // Unwind levelOptions array
    //   {
    //     $lookup: {
    //       from: "products", // The collection name where product details are stored
    //       localField: "productRef",
    //       foreignField: "_id",
    //       as: "productDetails"
    //     }
    //   },
    //   { $unwind: "$productDetails" }, // Convert array to object if product exists
    //   {
    //     $project: {
    //       _id: "$variants.levelOptions._id",
    //       inventoryID: "$variants.levelOptions.inventoryID",
    //       level: "$variants.levelOptions.level",
    //       color: "$variants.color",
    //       name: "$variants.name",
    //       quantity: "$variants.levelOptions.quantity",
    //       availableQuantity: "$variants.levelOptions.availableQuantity",
    //       inventoryType: 1,
    //       createdAt: 1,
    //       updatedAt: 1,
    //       productRef: {
    //         productId: "$productDetails._id",
    //         name: "$productDetails.name",
    //         price: "$productDetails.price",
    //         mrpPrice: "$productDetails.mrpPrice"
    //       }
    //     }
    //   }
    // ]);


    return inventorys;
  }

  async updateInventory(id, payload) {
    const updatedInventory = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedInventory) {
      throw new Error("About Us not found");
    }
    return updatedInventory;
  }



  async getInventoryWithPagination(payload) {
    try {
      const inventorys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const inventorys = await this.#model
            .find({ warehouseRef: payload.warehouseRef })
            .sort({ createdAt: sortOrder })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: 'productRef' },
            ]);
          const totalInventory = await this.#model.countDocuments({ warehouseRef: payload.warehouseRef });

          return { doc: inventorys, totalDoc: totalInventory };
        }
      );

      return inventorys;
    } catch (error) {
      console.error("Error getting inventorys with pagination:", error);
      throw error;
    }
  }

  //  other services to handle this
  async findProductInfo(order) {
    const products = await this.#model.findById(order?.inventoryID).populate("productRef");
    return products
  }
  async inventoryOrderPlace(inventoryID, inventoryPayload, session) {
    console.log("inventoryOrderPlace", inventoryID, inventoryPayload)
    const results = await this.#model.findByIdAndUpdate(
      inventoryID,
      {
        $set: {
          availableQuantity: inventoryPayload.availableQuantity,
          holdQuantity: inventoryPayload.holdQuantity,
        },
      },
      { new: true, session }
    );
    return results;
  }

  async updateInventoryStatus(status, orderData, session) {
    console.log("updateInventoryStatus", status, orderData)
    // 'OrderPlaced', 
    // 'DeliveredPending', 
    // 'Delivered', 
    // 'PartialDelivered', 
    // 'Cancelled', 
    // 'Hold', 
    // 'InReview'
    const totalQuantity = orderData.products.reduce((total, product) => total + product.quantity, 0);
    console.log("result --===", totalQuantity)

    let result;
    if (status == 'OrderPlaced') {
      console.log("status --=== OrderPlaced",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        return result;
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status --=== DeliveredPending",)
        return result;
      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                soldQuantity: -product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("Delivered --===", result)
        }
      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                // availableQuantity: product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        return result;
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        return result;
      }
    } else if (status == 'DeliveredPending') {
      console.log("status --=== DeliveredPending",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        return result;
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status --=== DeliveredPending",)
        return result;
      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                soldQuantity: -product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("Delivered --===", result)
        }
      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                // availableQuantity: product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        return result;
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        return result;
      }
    } else if (status == 'Delivered') {
      console.log("status --=== Delivered",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: -product.quantity,
                // availableQuantity: product.quantity,
                soldQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status b --=== DeliveredPending",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: -product.quantity,
                // availableQuantity: -product.quantity,
                soldQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        return result;
      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: -product.quantity,
                availableQuantity: -product.quantity,
                soldQuantity: product.quantity,
                // holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: -product.quantity,
                // availableQuantity: -product.quantity,
                holdQuantity: -product.quantity,
                soldQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: -product.quantity,
                // availableQuantity: -product.quantity,
                holdQuantity: -product.quantity,
                soldQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      }
    } else if (status == 'Cancelled') {
      console.log("status --=== Cancelled",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                // quantity: product.quantity,
                availableQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status --=== DeliveredPending",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                // quantity: product.quantity,
                availableQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }

      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                availableQuantity: product.quantity,
                soldQuantity: -product.quantity,
                // holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }

      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        return result;
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                // quantity: product.quantity,
                availableQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                // quantity: product.quantity,
                availableQuantity: product.quantity,
                holdQuantity: -product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      }
    } else if (status == 'Hold') {
      console.log("status --=== Hold",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        return result;
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status --=== DeliveredPending",)
        return result;
      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                soldQuantity: -product.quantity,
                // availableQuantity: -product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                // availableQuantity: product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        return result;
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        return result;
      }
    } else if (status == 'InReview') {
      console.log("status --=== InReview",)
      if (orderData?.status == 'OrderPlaced') {
        console.log("orderData?.status --=== OrderPlaced",)
        return result;
      } else if (orderData?.status == 'DeliveredPending') {
        console.log("orderData?.status --=== DeliveredPending",)
        return result;
      } else if (orderData?.status == 'Delivered') {
        console.log("orderData?.status --=== Delivered",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                soldQuantity: -product.quantity,
                // availableQuantity: -product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Cancelled') {
        console.log("orderData?.status --=== Cancelled",)
        for (const product of orderData?.products) {
          result = await this.#model.findByIdAndUpdate(
            product.inventoryRef,
            {
              $inc: {
                quantity: product.quantity,
                // availableQuantity: product.quantity,
                holdQuantity: product.quantity,
              }
            },
            { new: true, session }
          );
          console.log("result --===", result)
        }
      } else if (orderData?.status == 'Hold') {
        console.log("orderData?.status --=== Hold",)
        return result;
      } else if (orderData?.status == 'InReview') {
        console.log("orderData?.status --=== InReview",)
        return result;
      }
    }

    console.log("result --===", result)
    return result;

  }

  async updateInventoryOnOrderPlace(inventoryRef, quantity, session) {
    console.log("updateInventoryOnOrderPlace", inventoryRef, quantity)
    const results = await this.#model.findByIdAndUpdate(
      inventoryRef,
      {
        $inc: {
          availableQuantity: -quantity,
          holdQuantity: +quantity,
        },
      },
      { new: true, session }
    );
    // console.log("results --=== updateInventoryOnOrderPlace", results)
    return results;
  }

  async findInventoryByWarehous(inventoryRef, warehouseRef) {
    const inventory = await this.#model.findOne({ _id: inventoryRef, warehouseRef: warehouseRef });
    return inventory;
  }

}

module.exports = new InventoryRepository(InventorySchema);

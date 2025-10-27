const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const orderRepository = require("./order.repository.js");

const cartRepository = require("../cart/cart.repository.js");
const inventoryRepository = require("../inventory/inventory.repository.js");
const { idGenerate } = require("../../utils/IdGenerator.js");
const { PaymentSchema } = require("../../models/index.js");

class OrderService extends BaseService {
  #repository;
  #cartRepository;
  #inventoryRepository;
  constructor(repository, cartRepository, inventoryRepository, serviceName) {
    super(repository, cartRepository, serviceName);
    this.#repository = repository;
    this.#cartRepository = cartRepository;
    this.#inventoryRepository = inventoryRepository;
  }

  async createOrder(payload, session) {
    const { subTotalPrice,
      totalPrice,
      shippingCost,
      coupon,
      userRef,
      customerName,
      customerPhone,
      customerEmail,
      customerCity,
      customerAddress,
      customerAltPhone,
      paymentMethod,
    } = payload;
    if (!userRef) throw new NotFoundError("User is required");
    if (!customerName) throw new NotFoundError("Customer name is required");
    if (!customerPhone) throw new NotFoundError("Customer phone is required");
    // if (!customerEmail) throw new NotFoundError("Customer email is required");
    if (!customerCity) throw new NotFoundError("Customer city is required");
    // if (!customerAddress)
    //   throw new NotFoundError("Customer address is required");
    // if (!customerAltPhone)
    //   throw new NotFoundError("Customer alt phone is required");
    if (!paymentMethod)
      throw new NotFoundError("Payment method is required");
    if (shippingCost== null || shippingCost == undefined) throw new NotFoundError("Shipping cost is required");
    // if (!subTotalPrice) throw new NotFoundError("Sub total price is required");
    // if (!totalPrice) throw new NotFoundError("Total price is required");
    const orderId = await idGenerate("ORD-", "orderId", this.#repository);
    payload.orderId = orderId;
    // inventory update
    const orderData = await this.#repository.createOrder(payload, session);
    console.log("orderData", orderData);

    return orderData;
  }

  async createAdminOrder(payload, session) {
    const { userRef, orders, warehouseRef, payment } = payload;
    let paymentResult = null;
    if (payment > 0) {
      const paymentPayload = {
        amount: payment,
        userRef: userRef,
        warehouseRef: warehouseRef,
      };
      paymentResult = await PaymentSchema.create([paymentPayload], { session });
      payload.paymentRef = [paymentResult[0]?._id];
    }

    if (!warehouseRef) throw new NotFoundError("Warehouse is required");
    console.log("CreateOrder", payload);
    let productIds = [];
    let totalPrice = 0;
    let subTotalPrice = 0;
    let totalDiscount = 0;
    for (const order of orders) {
      const productInfo = await this.#inventoryRepository.findProductInfo(
        order
      );
      productIds.push({
        productRef: productInfo?.productRef?._id,
        inventoryRef: order?.inventoryID,
        quantity: order?.quantity,
        color: productInfo?.name,
        level: productInfo?.level,
        productDiscount: order?.discount,
      });
      totalPrice += productInfo?.productRef?.mrpPrice * Number(order?.quantity);
      totalDiscount += Number(order?.discount) * Number(order?.quantity) || 0;
      subTotalPrice +=
        productInfo?.productRef?.mrpPrice * Number(order?.quantity) -
        totalDiscount || 0;

      const availableQuantity = productInfo?.availableQuantity || 0;
      const quantityToHold = Number(order?.quantity);
      console.log(
        "availableQuantity, quantityToHold",
        availableQuantity,
        quantityToHold
      );
      if (availableQuantity < quantityToHold) {
        throw new Error(
          `Insufficient stock for product ${productInfo?.productRef?.name}`
        );
      }
      const inventoryID = order?.inventoryID;
      const inventoryPayload = {
        availableQuantity: availableQuantity - quantityToHold,
        holdQuantity: Number(productInfo?.holdQuantity) + quantityToHold,
      };
      await this.#inventoryRepository.inventoryOrderPlace(
        inventoryID,
        inventoryPayload,
        session
      );
      console.log("ProductInfo", productInfo);
    }

    payload.products = productIds;
    payload.totalPrice = totalPrice;
    payload.subTotalPrice = subTotalPrice;
    payload.discount = totalDiscount;

    payload.orderId = await idGenerate("ORD-", "orderId", this.#repository);

    const orderData = await this.#repository.create(payload, session);
    if (payment > 0) {
      const updatedPayment = await PaymentSchema.findByIdAndUpdate(
        paymentResult[0]._id,
        { orderRef: orderData[0]._id },
        { session, new: true }
      );
    }

    return orderData;
  }

  async getAllOrder() {
    return await this.#repository.findAll(
      {},
      ["products.productRef", "products.inventoryRef"],
      {
        "products.productRef": "productId",
        "products.inventoryRef": "inventoryID",
      }
    );
  }

  async getOrderWithPagination(payload) {
    const order = await this.#repository.getOrderWithPagination(payload);
    return order;
  }

  async getSingleOrder(id) {
    const orderData = await this.#repository.findById(id);
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async getUserAllOrder(id) {
    const isObjectId = /^[a-f\d]{24}$/i.test(id);
    const query = {};
    if (!isObjectId) {
      query.correlationId = id;
    } else {
      query.userRef = id;
    }

    const orderData = await this.#repository.findAll(query, ["products.productRef"]);
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async orderTracking(payload) {
    const { orderId } = payload;
    console.log("orderId", orderId);
    const orderData = await this.#repository.findAll({ orderId: orderId });
    if (!orderData) throw new NotFoundError("Order Not Find");
    return orderData;
  }

  async updateOrder(id, payload) {
    // Update the database with the new data
    const orderData = await this.#repository.updateOrder(id, payload);
    return orderData;
  }

  async updateOrderStatus(id, status, session) {
    if (!status) throw new NotFoundError("Status is required");
    const orderData = await this.#repository.findById(id);
    if (!orderData) throw new NotFoundError("Order not found");
    const updateInventoryStatus =
      await this.#inventoryRepository.updateInventoryStatus(
        status,
        orderData,
        session
      );
    // console.log("Update Order Status", orderData);
    // // ll

    const order = await this.#repository.updateOrderStatus(id, status, session);
    console.log("order", order);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

    async isCourierSending(id, session) {
    const orderData = await this.#repository.findById(id);
    if (!orderData) throw new NotFoundError("Order not found");
    const order = await this.#repository.updateById(id,{isCourierSend: true}, session);
    if (!order) throw new NotFoundError("Order not found");
    return order;
  }

  async deleteOrder(id, session) {
    const order = await this.#repository.findById(id);
    if (!order) throw new NotFoundError("Order not found");
    console.log("delete order", order);
    for (const product of order?.products) {
      const inventoryRef = product?.inventoryRef;
      const inventory = await this.#inventoryRepository.findById(inventoryRef);
      console.log("status --=== OrderPlaced");
      let inventoryPayload = {};
      if (order?.status == "OrderPlaced") {
        console.log("order?.status --=== OrderPlaced");
        inventoryPayload.availableQuantity =
          inventory?.availableQuantity + Number(product?.quantity);
        inventoryPayload.holdQuantity =
          inventory?.holdQuantity - Number(product?.quantity);
      } else if (order?.status == "DeliveredPending") {
        console.log("product?.status --=== DeliveredPending");
        inventoryPayload.availableQuantity =
          inventory?.availableQuantity + Number(product?.quantity);
        inventoryPayload.holdQuantity =
          inventory?.holdQuantity - Number(product?.quantity);
      } else if (order?.status == "Delivered") {
        console.log("product?.status --=== Delivered");
        // no need to calcuation this order delivered and money is also received
      } else if (order?.status == "Cancelled") {
        console.log("product?.status --=== Cancelled");
        // nop need to calcuation this order is cancelled
      } else if (order?.status == "Hold") {
        console.log("product?.status --=== Hold");
        inventoryPayload.availableQuantity =
          inventory?.availableQuantity + Number(product?.quantity);
        inventoryPayload.holdQuantity =
          inventory?.holdQuantity - Number(product?.quantity);
      } else if (order?.status == "InReview") {
        console.log("orderData?.status --=== InReview");
        inventoryPayload.availableQuantity =
          inventory?.availableQuantity + Number(product?.quantity);
        inventoryPayload.holdQuantity =
          inventory?.holdQuantity - Number(product?.quantity);
      }
      // const inventoryPayload = {
      //   availableQuantity: inventory?.availableQuantity + Number(order?.quantity),
      //   holdQuantity: inventory?.holdQuantity - Number(order?.quantity),
      // }
      await this.#inventoryRepository.inventoryOrderPlace(
        inventoryRef,
        inventoryPayload,
        session
      );
    }
    const deletedOrder = await this.#repository.deleteById(id, session);
    return deletedOrder;
  }
}

module.exports = new OrderService(
  orderRepository,
  cartRepository,
  inventoryRepository,
  "order"
);

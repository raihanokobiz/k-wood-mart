const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const cartRepository = require("./cart.repository.js");

class CartService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createCart(payload, session) {

    const { quantity, userRef, productRef, inventoryRef } = payload;
    if (!productRef && !inventoryRef) {
      throw new Error("Product ID & Inventory ID is required");
    }
    // console.log("file", files);

    // const existingCart = await this.#repository.findCartByUserAndProduct(
    //   userRef,
    //   correlationId: payload.correlationId,
    //   productRef,
    //   // color,
    //   // size,
    //   inventoryRef
    // );
    const query = {};
    const isObjectId = /^[a-f\d]{24}$/i.test(payload?.userRef);
    if (isObjectId) {
      query.userRef = userRef;
      query.productRef = productRef;
      query.inventoryRef = inventoryRef;
    } else {
      query.correlationId = userRef;
      query.productRef = productRef;
      query.inventoryRef = inventoryRef;
    }

    const existingCart = await this.#repository.findCartByUserAndProduct(query);

    let cartData;
    if (existingCart) {
      // Update the existing cart's quantity
      const updatedQuantity = Number(existingCart.quantity) + Number(quantity);
      cartData = await this.#repository.updateCartQuantity(
        existingCart._id,
        updatedQuantity
        // session
      );
    } else {
      // Create a new cart document
      cartData = await this.#repository.createCart(payload, session);
    }
    return cartData;
  }

  async getAllCart() {
    return await this.#repository.findAll({}, ["productRef"]);
  }

  async getAllCartByUser(payload) {
    return await this.#repository.getAllCartByUser(payload);
  }

  async getCartWithPagination(payload) {
    const cart = await this.#repository.getCartWithPagination(payload);
    return cart;
  }

  async getSingleCart(id) {
    const cartData = await this.#repository.findById(id);
    if (!cartData) throw new NotFoundError("Cart Not Find");
    return cartData;
  }

  async updateCart(id, payload) {
    // const { quantity, userRef, color, size, productRef } = payload;
    const cartData = await this.#repository.updateCart(id, payload);

    return cartData;
  }

  async updateCartQuantity(cartId, newQuantity) {
    const updatedCart = await cartRepository.updateCartQuantity(
      cartId,
      newQuantity
    );
    if (!updatedCart) {
      throw new Error("Cart not found");
    }
    // Optionally, calculate totals and return them here
    return updatedCart;
  }

  async deleteCart(id) {
    const cart = await this.#repository.findById(id);
    if (!cart) throw new NotFoundError("Cart not found");
    const deletedCart = await this.#repository.deleteById(id);
    console.log("cart", cart);

    return deletedCart;
  }
}

module.exports = new CartService(cartRepository, "cart");

const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const CartService = require("./cart.service.js");
const { default: mongoose } = require("mongoose");

class CartController {
  // Create a cart item
  createCart = withTransaction(async (req, res, next, session) => {
    console.log(req.body);

    const payload = {
      quantity: req.body.quantity || 1,
      // color: req.body.color,
      // size: req.body.size,
      userRef: req.body.userRef,
      productRef: req.body.productRef,
      inventoryRef: req.body.inventoryRef,
    };
    console.log("payload", payload);
    const cartResult = await CartService.createCart(payload, session);
    const resDoc = responseHandler(
      201,
      "Cart Created successfully",
      cartResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getAllCart = catchError(async (req, res) => {
    const cartResult = await CartService.getAllCart();
    const resDoc = responseHandler(200, "Get All Carts", cartResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get all cart items by user with calculation
  getAllCartByUser = catchError(async (req, res) => {
    const { userId, coupon, productRef , inventoryRef} = req.query;
    const payload = { userId , productRef, inventoryRef};
    if (coupon) {
      payload.coupon = coupon;
    }
    const cartResult = await CartService.getAllCartByUser(payload);

    const resDoc = responseHandler(
      200,
      ` ${cartResult?.message} `,
      cartResult?.data
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCartWithPagination = catchError(async (req, res) => {
    const userId = req.query.userId;
    const queryUserId = new mongoose.Types.ObjectId(userId);
    let payload = {
      userId: queryUserId,
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const cart = await CartService.getCartWithPagination(payload);
    const resDoc = responseHandler(200, "Carts get successfully", cart);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCart = catchError(async (req, res) => {
    const id = req.params.id;
    const cartResult = await CartService.getSingleCart(id);
    const resDoc = responseHandler(201, "Single Cart successfully", cartResult);
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCart = catchError(async (req, res) => {
    const id = req.params.id;
    const payload = {
      quantity: req.body.quantity,
      // color: req.body.color,
      // size: req.body.size,
      userRef: req.body.userRef,
      productRef: req.body.productRef,
      inventoryRef: req.body.inventoryRef,
    };
    await CartService.updateCart(id, payload);
    const resDoc = responseHandler(201, "Cart Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Update cart quanity with calculation
  updateCartQuantity = catchError(async (req, res) => {
    try {
      const cartId = req.params.id;
      const { increment, decrement, update } = req.query; // Retrieve query params
      let newQuantity;

      // Fetch the current cart item
      const currentCart = await CartService.getSingleCart(cartId);
      if (!currentCart) {
        return res.status(404).json({
          success: false,
          message: "Cart not found",
        });
      }

      if (increment === "true") {
        // Increment quantity
        newQuantity = currentCart.quantity + 1;
      } else if (decrement === "true") {
        // Decrement quantity, ensuring it doesn't drop below 1
        newQuantity = Math.max(1, currentCart.quantity - 1);
      } else if (update === "true") {
        // Update with a specific value from body
        const { quantity } = req.body;
        if (!quantity || quantity < 1) {
          return res.status(400).json({
            success: false,
            message: "Invalid quantity provided",
          });
        }
        newQuantity = quantity;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid operation, specify increment, decrement, or update",
        });
      }

      // Update the cart quantity in the database
      const updatedCart = await CartService.updateCartQuantity(
        cartId,
        newQuantity
      );

      return res.status(200).json({
        success: true,
        data: updatedCart,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });

  // Delete a cart item
  deleteCart = catchError(async (req, res) => {
    const id = req.params.id;
    await CartService.deleteCart(id);
    const resDoc = responseHandler(200, "Cart Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new CartController();

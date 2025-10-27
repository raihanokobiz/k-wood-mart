const { OrderSchema, InventorySchema } = require("../../models/index.js");
const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const orderRepository = require("../order/order.repository.js");

class ReportService extends BaseService {
  #orderRepository;
  constructor(orderRepository, serviceName) {
    super(orderRepository, serviceName);
    this.#orderRepository = orderRepository;
  }

  async getOrderReport(payload) {
    const { duration } = payload;
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();

    const setStart = (y, m, d) => startDate.setFullYear(y, m, d);
    const setEnd = (y, m, d) => endDate.setFullYear(y, m, d);

    switch (duration) {
      case "this-day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-day":
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-week":
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-week":
        startDate.setDate(now.getDate() - now.getDay() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-month":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-month":
        setStart(now.getFullYear(), now.getMonth() - 1, 1);
        setEnd(now.getFullYear(), now.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-year":
        setStart(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-year":
        setStart(now.getFullYear() - 1, 0, 1);
        setEnd(now.getFullYear() - 1, 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error("Invalid duration");
    }

    return await this.#orderRepository.getOrderReport(startDate, endDate);
  }

  async getProfitLossReport(payload) {
    const { duration, warehouseRef } = payload;
    const now = new Date();
    let startDate = new Date();
    let endDate = new Date();
    const setStart = (y, m, d) => startDate.setFullYear(y, m, d);
    const setEnd = (y, m, d) => endDate.setFullYear(y, m, d);
    switch (duration) {
      case "this-day":
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-day":
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(now.getDate() - 1);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-week":
        startDate.setDate(now.getDate() - now.getDay());
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-week":
        startDate.setDate(now.getDate() - now.getDay() - 7);
        startDate.setHours(0, 0, 0, 0);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-month":
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-month":
        setStart(now.getFullYear(), now.getMonth() - 1, 1);
        setEnd(now.getFullYear(), now.getMonth(), 0);
        endDate.setHours(23, 59, 59, 999);
        break;
      case "this-year":
        setStart(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case "prv-year":
        setStart(now.getFullYear() - 1, 0, 1);
        setEnd(now.getFullYear() - 1, 11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
      default:
        throw new Error("Invalid duration");
    }
    return await this.#orderRepository.getProfitLossReport(
      startDate,
      endDate,
      warehouseRef
    );
  }

  async getDashboardMetrics() {
    // Total Orders
    const totalOrders = await OrderSchema.countDocuments();

    // Total Sales
    const totalSalesResult = await OrderSchema.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);
    const totalSales = totalSalesResult[0]?.totalSales || 0;

    // Total Stock
    const totalStockResult = await InventorySchema.aggregate([
      {
        $group: {
          _id: null,
          totalStock: { $sum: "$quantity" },
        },
      },
    ]);
    const totalStock = totalStockResult[0]?.totalStock || 0;

    // Total Stock Value
    const totalStockValueResult = await InventorySchema.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productRef",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          stockValue: { $multiply: ["$quantity", "$product.price"] },
        },
      },
      {
        $group: {
          _id: null,
          totalStockValue: { $sum: "$stockValue" },
        },
      },
    ]);
    const totalStockValue = totalStockValueResult[0]?.totalStockValue || 0;

    return {
      totalOrders,
      totalSales,
      totalStock,
      totalStockValue,
    };
  }
}

module.exports = new ReportService(orderRepository, "Report");

const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const orderBulkRepository = require("./order.bulk.repository.js");

class OrderBulkService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createOrderBulk(payload, session) {
    const { name, email,
      phone, address,
      companyName, productType,
      deliveryDate, quantity,
      description } = payload;
    if (!name || !phone) {
      throw new Error("Name and phone are required fields.");
    }

    let orderBulkData = await this.#repository.createOrderBulk(payload, session);
    return orderBulkData;
  }

  async getAllOrderBulk() {
    return await this.#repository.findAll({}, []);
  }



  async getOrderBulkWithPagination(payload) {
    const orderBulk = await this.#repository.getOrderBulkWithPagination(payload);
    return orderBulk;
  }

  async getSingleOrderBulk(id) {
    const orderBulkData = await this.#repository.findById(id);
    if (!orderBulkData) throw new NotFoundError("OrderBulk Not Find");
    return orderBulkData;
  }

  async updateOrderBulk(id, payload) {
    const { name, phone } = payload;
    if (!name || !phone) {
      throw new Error("Name and phone are required fields.");
    }
    const orderBulkData = await this.#repository.updateOrderBulk(id, payload);

    return orderBulkData;
  }

  async deleteOrderBulk(id) {
    const orderBulk = await this.#repository.findById(id);
    if (!orderBulk) throw new NotFoundError("OrderBulk not found");
    const deletedOrderBulk = await this.#repository.deleteById(id);
    return deletedOrderBulk;
  }
}

module.exports = new OrderBulkService(orderBulkRepository, "orderBulk");

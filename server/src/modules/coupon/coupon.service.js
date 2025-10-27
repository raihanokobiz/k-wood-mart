const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const couponRepository = require("./coupon.repository.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");

class CouponService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createCoupon(payload, session) {
    // const {
    //   code,
    //   discount,
    //   useLimit,
    //   used,
    //   startDate,
    //   expireDate,
    //   discountType,
    //   categoryRef,
    //   brandRef,
    //   subCategoryRef,
    // } = payload;

    const couponData = await this.#repository.createCoupon(payload, session);
    return couponData;
  }

  async getAllCoupon() {
    return await this.#repository.findAll({}, [
      "brandRef",
      "categoryRef",
      "subCategoryRef",
    ]);
  }

  async getCouponWithPagination(payload) {
    const coupon = await this.#repository.getCouponWithPagination(payload);
    return coupon;
  }

  async getSingleCoupon(id) {
    const couponData = await this.#repository.findById(id);
    if (!couponData) throw new NotFoundError("Coupon Not Find");
    return couponData;
  }

  async updateCoupon(id, payload) {
    // const {
    //   code,
    //   discount,
    //   useLimit,
    //   used,
    //   startDate,
    //   expireDate,
    //   discountType,
    //   categoryRef,
    //   brandRef,
    //   subCategoryRef,
    // } = payload;
    const couponData = await this.#repository.updateCoupon(id, payload);

    return couponData;
  }

  async updateCouponStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const coupon = await this.#repository.updateCouponStatus(id, {
      status: status,
    });
    console.log("coupon", coupon);
    if (!coupon) throw new NotFoundError("Coupon not found");
    return coupon;
  }

  async deleteCoupon(id) {
    const coupon = await this.#repository.findById(id);
    if (!coupon) throw new NotFoundError("Coupon not found");
    const deletedCoupon = await this.#repository.deleteById(id);
    return deletedCoupon;
  }

  async calculateCouponTotal(payload, session) {
    const calculationResult = await this.#repository.calculateCouponTotal(
      payload,
      session
    );
    return calculationResult;
  }
}

module.exports = new CouponService(couponRepository, "coupon");

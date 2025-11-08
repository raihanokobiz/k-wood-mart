const catchError = require("../../middleware/errors/catchError.js");
const responseHandler = require("../../utils/responseHandler.js");
const withTransaction = require("../../middleware/transactions/withTransaction.js");
const CategoryService = require("./category.service.js");

class CategoryController {
  createCategory = withTransaction(async (req, res, next, session) => {
    const payloadFiles = {
      files: req.files,
    };
    const payload = {
      name: req.body.name,
      slug: req.body.slug,
      // subCategoryRef: req.body.subCategoryRef,
      status: req.body.status,
      colorCode: req.body.colorCode,
    };
    const categoryResult = await CategoryService.createCategory(
      payloadFiles,
      payload,
      session
    );
    const resDoc = responseHandler(
      201,
      "Category Created successfully",
      categoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Controller Furniture
  getNavBarForFurniture = catchError(async (req, res, next) => {
    const navbarData = await CategoryService.getNavBarForFurniture();
    const resDoc = responseHandler(200, "Get Furniture Navbar", navbarData);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Controller Curtains
  getNavBarForCurtains = catchError(async (req, res, next) => {
    const navbarData = await CategoryService.getNavBarForCurtains();
    const resDoc = responseHandler(200, "Get Curtains Navbar", navbarData);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Get all categories
  getAllCategory = catchError(async (req, res) => {
    const categories = await CategoryService.getAllCategory();
    const resDoc = responseHandler(200, "Categories retrieved successfully", categories);
    res.status(resDoc.statusCode).json(resDoc);
  });

  // Or single endpoint with query param
  getAllNavBar = catchError(async (req, res) => {
    const { category } = req.query;

    let navbarData;
    if (category === "furniture") {
      navbarData = await CategoryService.getNavBarForFurniture();
    } else if (category === "curtains") {
      navbarData = await CategoryService.getNavBarForCurtains();
    } else {
      navbarData = await CategoryService.getAllNavBar();
    }

    const resDoc = responseHandler(200, "Get Navbar", navbarData);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getCategoryWithPagination = catchError(async (req, res) => {
    let payload = {
      page: req.query.page,
      limit: req.query.limit,
      order: req.query.order,
    };
    const category = await CategoryService.getCategoryWithPagination(payload);
    const resDoc = responseHandler(200, "Categorys get successfully", category);
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCategory = catchError(async (req, res) => {
    const id = req.params.id;
    const categoryResult = await CategoryService.getSingleCategory(id);
    const resDoc = responseHandler(
      201,
      "Single Category successfully",
      categoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  getSingleCategoryWithSlug = catchError(async (req, res) => {
    const slug = req.params.slug;
    const categoryResult = await CategoryService.getSingleCategoryWithSlug(
      slug
    );
    const resDoc = responseHandler(
      201,
      "Single Category successfully",
      categoryResult
    );
    res.status(resDoc.statusCode).json(resDoc);
  });

  // These methods are already defined above, removing duplicates

  updateCategory = catchError(async (req, res) => {
    const id = req.params.id;
    const payloadFiles = {
      files: req?.files,
    };
    const payload = {
      name: req.body.name,
      slug: req.body.slug,
      // subCategoryRef: req.body.subCategoryRef,
      status: req.body.status,
      colorCode: req.body.colorCode,
    };
    await CategoryService.updateCategory(
      id,
      payloadFiles,
      payload
    );
    const resDoc = responseHandler(201, "Category Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  updateCategoryStatus = catchError(async (req, res) => {
    const id = req.params.id;
    const status = req.query.status;
    await CategoryService.updateCategoryStatus(
      id,
      status
    );
    const resDoc = responseHandler(201, "Category Status Update successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });

  deleteCategory = catchError(async (req, res) => {
    const id = req.params.id;
    await CategoryService.deleteCategory(id);
    const resDoc = responseHandler(200, "Category Deleted successfully");
    res.status(resDoc.statusCode).json(resDoc);
  });
}

module.exports = new CategoryController();

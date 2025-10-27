// const { CategorySchema } = require("../../models/index.js");
const { default: mongoose } = require("mongoose");
const { CategorySchema } = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class CategoryRepository extends BaseRepository {
  #model;
  constructor(model) {
    super(model);
    this.#model = model;
  }

  async createCategory(payload, session) {
    const newCategory = await this.#model.create([payload], { session });
    return newCategory;
  }

  async getAllCategory() {
    const categories = await this.#model.find({}).sort({ createdAt: -1 });
    return categories;
  }

  async getNavBar() {
    const navBar = await CategorySchema.aggregate([
      {
        $lookup: {
          from: "subcategories",
          localField: "_id",
          foreignField: "categoryRef",
          as: "subCategories",
        },
      },
      {
        $lookup: {
          from: "childcategories",
          localField: "subCategories._id",
          foreignField: "subCategoryRef",
          as: "childCategories",
        },
      },
      {
        $lookup: {
          from: "subchildcategories",
          localField: "childCategories._id",
          foreignField: "childCategoryRef",
          as: "subChildCategories",
        },
      },
      // {
      //   $addFields: {
      //     "subCategories.childCategories": {
      //       $filter: {
      //         input: "$childCategories",
      //         as: "child",
      //         cond: {
      //           $eq: ["$$child.subCategoryRef", "$$child.subCategoryRef"],
      //         },
      //       },
      //     },
      //   },
      // },
      {
        $addFields: {
          subCategories: {
            $map: {
              input: "$subCategories",
              as: "sub",
              in: {
                $mergeObjects: [
                  "$$sub",
                  {
                    childCategories: {
                      $filter: {
                        input: "$childCategories",
                        as: "child",
                        cond: {
                          $eq: ["$$child.subCategoryRef", "$$sub._id"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      

      {
        $project: {
          childCategories: 0,
        },
      },
    ]);
    return navBar;
  }
  async getCategoryById(categoryId) {
    const category = await this.#model.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(categoryId) }, // Match the specific category ID
      },
      {
        $lookup: {
          from: "subcategories", // Name of the subcategory collection in MongoDB
          localField: "_id", // Field in the Category collection to match
          foreignField: "categoryRef", // Field in the Subcategory collection to match
          as: "subCategories", // Alias for the joined subcategories
        },
      },
      {
        $limit: 1, // Ensure only one result is returned (optional but useful for clarity)
      },
    ]);

    // Return the first category if it exists, otherwise return null
    return category.length > 0 ? category[0] : null;
  }

  async getCategoryBySlug(slug) {
    const category = await this.#model.aggregate([
      {
        $match: { slug: slug }, // Match the specific category ID
      },
      {
        $lookup: {
          from: "subcategories", // Name of the subcategory collection in MongoDB
          localField: "_id", // Field in the Category collection to match
          foreignField: "categoryRef", // Field in the Subcategory collection to match
          as: "subCategories", // Alias for the joined subcategories
        },
      },
      {
        $limit: 1, // Ensure only one result is returned (optional but useful for clarity)
      },
    ]);

    // Return the first category if it exists, otherwise return null
    return category.length > 0 ? category[0] : null;
  }

  async updateCategory(id, payload) {
    const updatedCategory = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedCategory) {
      throw new Error("About Us not found");
    }
    return updatedCategory;
  }

  async getCategoryWithPagination(payload) {
    try {
      const categorys = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const categorys = await this.#model.aggregate([
            {
              $sort: { createdAt: sortOrder }, // Sort by createdAt in the desired order
            },
            {
              $skip: offset, // Skip records for pagination
            },
            {
              $limit: limit, // Limit records for pagination
            },
            {
              $lookup: {
                from: "subcategories", // Name of the subcategory collection in MongoDB
                localField: "_id", // Field in the Category collection to match
                foreignField: "categoryRef", // Field in the Subcategory collection to match
                as: "subCategories", // Alias for the joined subcategories
              },
            },
          ]);
          const totalCategory = await this.#model.countDocuments();

          return { doc: categorys, totalDoc: totalCategory };
        }
      );

      return categorys;
    } catch (error) {
      console.error("Error getting categorys with pagination:", error);
      throw error;
    }
  }
}

module.exports = new CategoryRepository(CategorySchema);

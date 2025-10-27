// const { ProductSchema } = require("../../models/index.js");
const { default: mongoose } = require("mongoose");
const {
  ProductSchema,
  CategorySchema,
  OrderSchema,
  SubCategorySchema,
  ChildCategorySchema,
  SubChildCategorySchema,
  BrandSchema,
} = require("../../models/index.js");
const pagination = require("../../utils/pagination.js");
const BaseRepository = require("../base/base.repository.js");

class ProductRepository extends BaseRepository {
  #model;
  #brandModel;
  constructor(model, brandModel) {
    super(model);
    this.#model = model;
    this.#brandModel = brandModel;
  }

  async createProduct(payload, session) {
    const newProduct = await this.#model.create([payload], { session });
    return newProduct;
  }

  async updateProduct(id, payload) {
    const updatedProduct = await this.#model.findByIdAndUpdate(id, payload);
    if (!updatedProduct) {
      throw new Error("About Us not found");
    }
    return updatedProduct;
  }

  async getProductWithPagination(payload) {
    try {
      const {
        sortBy = "createdAt",
        minPrice,
        maxPrice,
        categoryId,
        categorySlug,
        subCategoryId,
        subCategorySlug,
        childCategoryId,
        childCategorySlug,
        subChildCategoryId,
        subChildCategorySlug,
        brandId,
        brandSlug,
        isNewArrival,
        color,
        size,
        popular,
        bestSell,
        featured,
        gender,
      } = payload;
      console.log('Payload MIN AND MAX PRODUCT=========',{minPrice,maxPrice})

      const filter = {};
      if (minPrice && maxPrice) {
        filter.price = {}; filter.price.$gte = parseFloat(minPrice);
         filter.price.$lte = parseFloat(maxPrice);
      }
console.log('filter log',filter)
      const orCategoryIds = [];

      if (categoryId) {
        const categoryArray = Array.isArray(categoryId)
          ? categoryId
          : [categoryId];
        orCategoryIds.push({
          categoryRef: {
            $in: categoryArray.map((id) => new mongoose.Types.ObjectId(id)),
          },
        });
      }

      if (subCategoryId) {
        const subCategoryArray = Array.isArray(subCategoryId)
          ? subCategoryId
          : [subCategoryId];
        orCategoryIds.push({
          subCategoryRef: {
            $in: subCategoryArray.map((id) => new mongoose.Types.ObjectId(id)),
          },
        });
      }

      if (childCategoryId) {
        const childCategoryArray = Array.isArray(childCategoryId)
          ? childCategoryId
          : [childCategoryId];
        orCategoryIds.push({
          childCategoryRef: {
            $in: childCategoryArray.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        });
      }

      if (subChildCategoryId) {
        const subChildCategoryArray = Array.isArray(subChildCategoryId)
          ? subChildCategoryId
          : [subChildCategoryId];
        orCategoryIds.push({
          subChildCategoryRef: {
            $in: subChildCategoryArray.map(
              (id) => new mongoose.Types.ObjectId(id)
            ),
          },
        });
      }

      if (orCategoryIds.length > 0) {
        filter.$or = [...(filter.$or || []), ...orCategoryIds];
      }

      const orCategoryFilters = [];

      if (categorySlug) {
        const slugs = Array.isArray(categorySlug)
          ? categorySlug
          : [categorySlug];
        const categories = await CategorySchema.find({ slug: { $in: slugs } });
        const ids = categories.map((c) => c._id);
        if (ids.length) {
          orCategoryFilters.push({ categoryRef: { $in: ids } });
        }
      }

      if (subCategorySlug) {
        const slugs = Array.isArray(subCategorySlug)
          ? subCategorySlug
          : [subCategorySlug];
        const subCategories = await SubCategorySchema.find({
          slug: { $in: slugs },
        });
        const ids = subCategories.map((s) => s._id);
        if (ids.length) {
          orCategoryFilters.push({ subCategoryRef: { $in: ids } });
        }
      }

      if (childCategorySlug) {
        const slugs = Array.isArray(childCategorySlug)
          ? childCategorySlug
          : [childCategorySlug];
        const childCategories = await ChildCategorySchema.find({
          slug: { $in: slugs },
        });
        const ids = childCategories.map((c) => c._id);
        if (ids.length) {
          orCategoryFilters.push({ childCategoryRef: { $in: ids } });
        }
      }

      if (subChildCategorySlug) {
        const slugs = Array.isArray(subChildCategorySlug)
          ? subChildCategorySlug
          : [subChildCategorySlug];
        const subChildCategories = await SubChildCategorySchema.find({
          slug: { $in: slugs },
        });
        const ids = subChildCategories.map((s) => s._id);
        if (ids.length) {
          orCategoryFilters.push({ subChildCategoryRef: { $in: ids } });
        }
      }

      if (orCategoryFilters.length > 0) {
        filter.$or = orCategoryFilters;
      }

      if (brandId) {
        filter.brandRef = new mongoose.Types.ObjectId(String(brandId));
      }

      if (brandSlug) {
        const brand = await BrandSchema.findOne({ slug: brandSlug });
        if (brand) {
          filter.brandRef = brand._id;
        } else {
          return { result: [], pagination: {}, filterOptions: {} };
        }
      }

      if (isNewArrival) {
        const daysAgo = 30; // Define how many days ago counts as "new"
        const newArrivalDate = new Date();
        newArrivalDate.setDate(newArrivalDate.getDate() - daysAgo);
        filter.createdAt = { $gte: newArrivalDate };
      }

      // Color filter
      if (color) {
        filter["inventoryRef.variants"] = {
          $elemMatch: { color: color }, // Matches any variant with the given color
        };
      }

      // Size filter
      if (size) {
        filter["inventoryRef.variants.sizeOptions"] = {
          $elemMatch: { size: size }, // Matches any variant with the given size
        };
      }

      if (gender) {
        filter.gender = gender;
      }

      // Sorting logic based on filters
      let sortCriteria = { [sortBy]: -1 };

      // Best-Selling Products (Sort by total orders)
      if (bestSell) {
        const bestSellingProducts = await OrderSchema.aggregate([
          { $unwind: "$products" },
          {
            $group: {
              _id: "$products.productRef",
              orderCount: { $sum: "$products.quantity" }, // Sum total quantity ordered
            },
          },
          { $sort: { orderCount: -1 } }, // Sort by highest orders
        ]);

        const productIds = bestSellingProducts.map((p) => p._id);
        filter._id = { $in: productIds }; // Filter product that are best sellers
        sortCriteria = { orderCount: -1 };
      }

      // Featured Products (Sort by highest discount)
      if (featured) {
        sortCriteria = { discountPercentage: -1 };
      }

      // Popular Products (Sort by highest orders + highest discount)
      if (popular) {
        const popularProducts = await OrderSchema.aggregate([
          { $unwind: "$products" },
          {
            $group: {
              _id: "$products.productRef",
              orderCount: { $sum: "$products.quantity" }, // Total sales count
            },
          },
          { $sort: { orderCount: -1 } },
        ]);

        const productIds = popularProducts.map((p) => p._id);
        filter._id = { $in: productIds };
        sortCriteria = { orderCount: -1, discountPercentage: -1 }; // Sort by highest orders + discount
      }

      const productsWithPagination = await pagination(
        payload,
        async (limit, offset) => {
          const product = await this.#model
            .find(filter)
            .sort(sortCriteria)
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "categoryRef" },
              { path: "subCategoryRef" },
              { path: "childCategoryRef" },
              { path: "subChildCategoryRef" },
              { path: "brandRef" },
              { path: "inventoryRef" },
            ]);
          const totalProducts = await this.#model.countDocuments();
          return { doc: product, totalDoc: totalProducts };
        }
      );

      // Aggregation for filter options
      const filterAggregation = await this.#model.aggregate([
        {$match:filter},
        {
          
          $group: {
            _id: null,
            minPrice: { $min: "$price" },
            maxPrice: { $max: "$price" },
            sizes: { $push: "$inventoryRef.variants.sizeOptions" },
            genders: { $addToSet: "$gender" },
          },
        },
        { $project: { _id: 0, minPrice: 1, maxPrice: 1, genders: 1 } },
      ]);
console.log('filter aggrigation',filterAggregation)
      const filterOptions = filterAggregation[0] || {
        colors: [],
        sizes: [],
        genders: [],
        minPrice: 0,
        maxPrice: 0,
      };
      console.log('filter option',filterOptions)

      // Flatten and get unique sizes
      const flattenedSizes = Array.isArray(filterOptions.sizes)
        ? filterOptions.sizes.flat()
        : [];

      const uniqueSizes = [...new Set(flattenedSizes)]; // Remove duplicates

      // Fetch categories with subcategories
      const categories = await this.getCategoriesWithSubcategoriesAndCounts();
      const brands = await this.#brandModel.find().sort({ name: -1 });
      console.log('calculated products min and max price ==================',{
        minPrice: filterOptions.minPrice,
        maxPrice: filterOptions.maxPrice,
      })
      return {
        result: productsWithPagination.result,
        pagination: productsWithPagination.pagination,
        filterOptions: {
          categories,
          brands,
          colors: filterOptions.colors,
          sizes: uniqueSizes,
          genders: filterOptions.genders || [],
          priceRange: {
            // minPrice: filterOptions.minPrice,
            minPrice: 0,
            maxPrice: filterOptions.maxPrice,
          },
        },
      };
    } catch (error) {
      console.error("Error getting product with pagination:", error);
      throw error;
    }
  }

  async getProductWithPaginationForAdmin(payload) {
    try {
      const productsWithPagination = await pagination(
        payload,
        async (limit, offset, sortOrder) => {
          const product = await this.#model
            .find()
            .sort({ createdAt: -1 })
            .skip(offset)
            .limit(limit)
            .populate([
              { path: "inventoryRef", select: "" },
              { path: "categoryRef", select: "" },
              { path: "subCategoryRef", select: "" },
              { path: "childCategoryRef", select: "" },
              { path: "subChildCategoryRef", select: "" },
              { path: "brandRef", select: "" },
            ]);

          // Filter out product without matching inventory
          const totalProduct = await this.#model.countDocuments();

          return { doc: product, totalDoc: totalProduct };
        }
      );
      return productsWithPagination;
    } catch (error) {
      console.error("Error getting product with pagination:", error);
      throw error;
    }
  }

  async getCategoriesWithSubcategoriesAndCounts() {
    try {
      const categories = await CategorySchema.aggregate([
        // Lookup subcategories linked to the category
        {
          $lookup: {
            from: "subcategories",
            localField: "_id",
            foreignField: "categoryRef",
            as: "subCategoryDetails",
          },
        },
        {
          $unwind: {
            path: "$subCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup child categories linked to the subcategory
        {
          $lookup: {
            from: "childcategories",
            localField: "subCategoryDetails._id",
            foreignField: "subCategoryRef",
            as: "childCategoryDetails",
          },
        },
        {
          $unwind: {
            path: "$childCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup sub-child categories linked to the child category
        {
          $lookup: {
            from: "subchildcategories",
            localField: "childCategoryDetails._id",
            foreignField: "childCategoryRef",
            as: "subChildCategoryDetails",
          },
        },
        {
          $unwind: {
            path: "$subChildCategoryDetails",
            preserveNullAndEmptyArrays: true,
          },
        },

        // Lookup product counts for each sub-child category
        {
          $lookup: {
            from: "products",
            let: { subChildCategoryId: "$subChildCategoryDetails._id" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ["$subChildCategoryRef", "$$subChildCategoryId"],
                  },
                },
              },
              { $count: "productCount" },
            ],
            as: "productCounts",
          },
        },
        {
          $addFields: {
            productCount: {
              $ifNull: [
                { $arrayElemAt: ["$productCounts.productCount", 0] },
                0,
              ],
            },
          },
        },

        // Group by child category
        {
          $group: {
            _id: {
              categoryId: "$_id",
              subCategoryId: "$subCategoryDetails._id",
              childCategoryId: "$childCategoryDetails._id",
            },
            categoryName: { $first: "$name" },
            categoryImage: { $first: "$image" },
            categoryColorCode: { $first: "$colorCode" },
            categorySlug: { $first: "$slug" },
            categoryStatus: { $first: "$status" },
            subCategoryName: { $first: "$subCategoryDetails.name" },
            subCategorySlug: { $first: "$subCategoryDetails.slug" },
            subCategoryStatus: { $first: "$subCategoryDetails.status" },
            childCategoryName: { $first: "$childCategoryDetails.name" },
            childCategorySlug: { $first: "$childCategoryDetails.slug" },
            childCategoryStatus: { $first: "$childCategoryDetails.status" },
            subChildCategories: {
              $push: {
                _id: "$subChildCategoryDetails._id",
                name: "$subChildCategoryDetails.name",
                slug: "$subChildCategoryDetails.slug",
                status: "$subChildCategoryDetails.status",
                productCount: "$productCount",
              },
            },
            childCategoryProductCount: { $sum: "$productCount" },
          },
        },

        // Group by subcategory
        {
          $group: {
            _id: {
              categoryId: "$_id.categoryId",
              subCategoryId: "$_id.subCategoryId",
            },
            categoryName: { $first: "$categoryName" },
            categoryImage: { $first: "$categoryImage" },
            categoryColorCode: { $first: "$categoryColorCode" },
            categorySlug: { $first: "$categorySlug" },
            categoryStatus: { $first: "$categoryStatus" },
            subCategoryName: { $first: "$subCategoryName" },
            subCategorySlug: { $first: "$subCategorySlug" },
            subCategoryStatus: { $first: "$subCategoryStatus" },
            childCategories: {
              $push: {
                _id: "$_id.childCategoryId",
                name: "$childCategoryName",
                slug: "$childCategorySlug",
                status: "$childCategoryStatus",
                subChildCategories: "$subChildCategories",
                childCategoryProductCount: "$childCategoryProductCount",
              },
            },
            subCategoryProductCount: { $sum: "$childCategoryProductCount" },
          },
        },

        // Group by category
        {
          $group: {
            _id: "$_id.categoryId",
            name: { $first: "$categoryName" },
            image: { $first: "$categoryImage" },
            colorCode: { $first: "$categoryColorCode" },
            slug: { $first: "$categorySlug" },
            status: { $first: "$categoryStatus" },
            subCategories: {
              $push: {
                _id: "$_id.subCategoryId",
                name: "$subCategoryName",
                slug: "$subCategorySlug",
                status: "$subCategoryStatus",
                childCategories: "$childCategories",
                subCategoryProductCount: "$subCategoryProductCount",
              },
            },
            categoryProductCount: { $sum: "$subCategoryProductCount" },
          },
        },

        {
          $sort: { name: 1 },
        },
      ]);

      return categories;
    } catch (error) {
      console.error(
        "Error getting categories with subcategories and counts:",
        error
      );
      throw error;
    }
  }
  async updateProductInventory(id, productRef, session) {
    const data = await this.#model.findByIdAndUpdate(
      productRef,
      { $pull: { inventoryRef: id } },
      { session }
    );
    return data;
  }
  async addProductInventory(id, productRef, session) {
    console.log("done adding product", id);
    const data = await this.#model.findByIdAndUpdate(
      productRef,
      { $push: { inventoryRef: id } },
      { session }
    );
    return data;
  }
  async getAllProductForHomePage(payload) {
    const { limit = 10, subCategoryRef } = payload;
    console.log("payload", payload);
    const product = await this.#model
      .find({
        subCategoryRef: subCategoryRef,
      })
      .limit(limit)
      .populate()
      .sort({ createdAt: -1 });
    return product;
  }

  async getRelatedProduct(payload) {
    const { id } = payload;
    console.log("payload", payload);
    const product = await this.#model.findById(id).populate("categoryRef");
    const relatedProducts = await this.#model
      .find({
        categoryRef: product.categoryRef._id,
        _id: { $ne: id },
      })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("inventoryRef");
    return relatedProducts;
  }

  async getSearchProduct(payload) {
    const { search } = payload;
    console.log("payload", payload);

    let query = {};

    if (search && search.trim() !== "") {
      query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    const product = await this.#model.find(query).sort({ createdAt: -1 });
    return product;
  }

  async getAllBestSellProduct(payload) {
    const { limit = 10 } = payload;

    let bestSellingProducts = await OrderSchema.aggregate([
  { $unwind: "$products" },
  {
    $group: {
      _id: "$products.productRef",
      totalSold: { $sum: "$products.quantity" },
    },
  },
  { $sort: { totalSold: -1 } },
  { $limit: limit },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product",
    },
  },
  { $unwind: "$product" },
  {
    $lookup: {
      from: "inventories",
      localField: "product.inventoryRef",
      foreignField: "_id",
      as: "product.inventoryRef",
    },
  },
  { $unwind: { path: "$product.inventoryRef", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: "$product._id",
      name: "$product.name",
      thumbnailImage: "$product.thumbnailImage",
      backViewImage: "$product.backViewImage",
      price: "$product.price",
      mrpPrice: "$product.mrpPrice",
      slug: "$product.slug",
      totalSold: 1,
      inventoryRef: "$product.inventoryRef",
      inventoryType: "$product.inventoryType",
    },
  },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      thumbnailImage: { $first: "$thumbnailImage" },
      backViewImage: { $first: "$backViewImage" },
      price: { $first: "$price" },
      mrpPrice: { $first: "$mrpPrice" },
      slug: { $first: "$slug" },
      totalSold: { $first: "$totalSold" },
      inventoryRef: { $first: "$inventoryRef" },
      inventoryType: { $first: "$inventoryType" }
    }
  }
]);

    if (bestSellingProducts.length < 10) {
      const missingCount = 10 - bestSellingProducts.length;
      const bestSellingProductIds = bestSellingProducts.map(p => p._id);
console.log("bestSellingProducts",bestSellingProductIds)
      const fallbackProducts = await ProductSchema.find({
        _id: { $nin: bestSellingProductIds }, // Exclude already fetched products
      })
        .limit(missingCount)  // fetch only missing products
        .select("_id name thumbnailImage backViewImage price mrpPrice slug inventoryType")
        .populate("inventoryRef"); // populate inventoryRef if needed
        // product _id is in  fallbackProducts do this 
              const fallbackProductsIds = fallbackProducts.map(p => p._id);
              console.log("fallbackProducts",fallbackProductsIds)


    
      const formattedFallbackProducts = fallbackProducts.map((product) => ({
        _id: product._id,
        name: product.name,
        thumbnailImage: product.thumbnailImage,
        backViewImage: product.backViewImage,
        price: product.price,
        mrpPrice: product.mrpPrice,
        slug: product.slug,
        totalSold: 0, // No sales info
        inventoryRef: product.inventoryRef,
        inventoryType: product.inventoryType
      }));
      // console.log("formattedFallbackProducts", formattedFallbackProducts)
    
      // Push fallback products into bestSellingProducts
      bestSellingProducts = [...bestSellingProducts, ...formattedFallbackProducts];
                    const bestSellingProductsIds = bestSellingProducts.map(p => p._id);
              console.log("bestSellingProductsIds",bestSellingProductsIds)
      // console.log("-----------------", bestSellingProducts)
    }
    return { products: bestSellingProducts };
  }

  async getAllDiscountedProduct(payload) {
    return await ProductSchema.find({
      isDiscounted: true,
    }).sort({ createdAt: -1 })
    .populate("inventoryRef");
  }
}

module.exports = new ProductRepository(ProductSchema, BrandSchema);

const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const blogTagRepository = require("./blogTag.repository.js");

class BlogTagService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createBlogTag(payload, session) {
    const { title } = payload;
    const blogTagData = await this.#repository.createBlogTag(payload, session);
    return blogTagData;
  }

  async getAllBlogTag() {
    return await this.#repository.findAll();
  }

  async getBlogTagWithPagination(payload) {
    const blogTag = await this.#repository.getBlogTagWithPagination(payload);
    return blogTag;
  }

  async getSingleBlogTag(id) {
    const blogTagData = await this.#repository.findById(id);
    if (!blogTagData) throw new NotFoundError("BlogTag Not Find");
    return blogTagData;
  }

  async updateBlogTag(id, payload, session) {
    const { title } = payload;

    const blogTagData = await this.#repository.updateById(id, payload, session);
    if (!blogTagData) throw new NotFoundError("BlogTag Not Find");

    return blogTagData;
  }

  async deleteBlogTag(id) {
    const blogTag = await this.#repository.findById(id);
    if (!blogTag) throw new NotFoundError("BlogTag not found");
    const deletedBlogTag = await this.#repository.deleteById(id);

    return deletedBlogTag;
  }
}

module.exports = new BlogTagService(blogTagRepository, "blogTag");

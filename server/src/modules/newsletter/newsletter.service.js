const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");
const newsletterRepository = require("./newsletter.repository.js");

class NewsletterService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createNewsletter(payload, session) {
    const { email } = payload;
    const newsletterData = await this.#repository.createNewsletter(payload);
    return newsletterData;
  }

  async getAllNewsletter() {
    return await this.#repository.findAll();
  }

  async getNewsletterWithPagination(payload) {
    const newsletter = await this.#repository.getNewsletterWithPagination(
      payload
    );
    return newsletter;
  }

  async getSingleNewsletter(id) {
    const newsletterData = await this.#repository.findById(id);
    if (!newsletterData) throw new NotFoundError("Newsletter Not Find");
    return newsletterData;
  }

  async updateNewsletter(id, payload, session) {
    const { email } = payload;
    const newsletterData = await this.#repository.updateById(id, payload);
    if (!newsletterData) throw new NotFoundError("Newsletter Not Find");

    return newsletterData;
  }

  async deleteNewsletter(id) {
    const newsletter = await this.#repository.findById(id);
    if (!newsletter) throw new NotFoundError("Newsletter not found");
    const deletedNewsletter = await this.#repository.deleteById(id);

    return deletedNewsletter;
  }
}

module.exports = new NewsletterService(newsletterRepository, "newsletter");

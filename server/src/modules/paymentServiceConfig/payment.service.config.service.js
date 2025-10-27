const { NotFoundError } = require("../../utils/errors.js");
const BaseService = require("../base/base.service.js");

const isArrayElementExist = require("../../utils/isArrayElementExist.js");
const paymentServiceConfigRepository = require("./payment.service.config.repository.js");
const { isMainThread } = require("worker_threads");
const { log } = require("console");
const {
  convertFileNameWithPdfExt,
} = require("../../middleware/upload/convertFileNameWithPdfExt.js");
const {
  convertFileNameWithWebpExt,
} = require("../../middleware/upload/convertFileNameWithWebpExt.js");
const { uploadWorker } = require("../../middleware/upload/uploadWorker.js");
const {
  convertImgArrayToObject,
} = require("../../middleware/upload/convertImgArrayToObject.js");
const {
  removeUploadFile,
} = require("../../middleware/upload/removeUploadFile.js");

class PaymentServiceConfigService extends BaseService {
  #repository;
  constructor(repository, serviceName) {
    super(repository, serviceName);
    this.#repository = repository;
  }

  async createPaymentServiceConfig(payload, session) {
    // const { files } = payloadFiles;
    const {
      status,
      grantType,
      password,
      email,
      clientSecret,
      clientId,
      clientKey,
      secretKey,
      apiKey,
      baseUrl,
      userName,
      serviceMethod,
    } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // console.log("file", files);

    // const requiredFiles = {
    //   image: false,
    // };

    // if (files) {
    //   files.forEach((file) => {
    //     if (requiredFiles.hasOwnProperty(file.fieldname)) {
    //       requiredFiles[file.fieldname] = true;
    //     }
    //   });
    // }

    // if (Object.values(requiredFiles).some((required) => !required)) {
    //   throw new Error(
    //     "All required images or documents must be provided: image, background Photo."
    //   );
    // }
    // let image;
    // if (Array.isArray(files) && files.length > 0 && isMainThread) {
    //   // Map over the files and prepare them for upload
    //   const imgFile = files.map(
    //     ({ buffer, originalname, fieldname, mimetype }) => ({
    //       buffer,
    //       originalname:
    //         mimetype === "application/pdf"
    //           ? convertFileNameWithPdfExt(originalname)
    //           : convertFileNameWithWebpExt(originalname),
    //       fieldname,
    //       mimetype,
    //     })
    //   );

    //   console.log("imgFile", imgFile);

    //   // Handle the upload of each file
    //   for (let file of imgFile) {
    //     try {
    //       await uploadWorker(file); // Assuming uploadWorker can handle one file at a time
    //     } catch (error) {
    //       console.error("Error uploading file:", error);
    //       throw new Error("File upload failed");
    //     }
    //   }

    //   // After upload, convert imgFile array to object format
    //   image = convertImgArrayToObject(imgFile);
    // } else {
    //   throw new Error("Invalid or empty files array");
    // }

    // for (const key in image) {
    //   payload[key] = image[key];
    // }

    const paymentServiceConfigData =
      await this.#repository.createPaymentServiceConfig(payload, session);
    return paymentServiceConfigData;
  }

  async getAllPaymentServiceConfig() {
    return await this.#repository.findAll();
  }

  async getPaymentServiceConfigWithPagination(payload) {
    const paymentServiceConfig =
      await this.#repository.getPaymentServiceConfigWithPagination(payload);
    return paymentServiceConfig;
  }

  async getSinglePaymentServiceConfig(id) {
    const paymentServiceConfigData = await this.#repository.findById(id);
    if (!paymentServiceConfigData)
      throw new NotFoundError("PaymentServiceConfig Not Find");
    return paymentServiceConfigData;
  }

  async updatePaymentServiceConfig(id, payload) {
    // const { files } = payloadFiles;
    const {
      status,
      grantType,
      password,
      email,
      clientSecret,
      clientId,
      clientKey,
      secretKey,
      apiKey,
      baseUrl,
      userName,
      serviceMethod,
    } = payload;
    // if (
    //   !header ||
    //   !title ||
    //   !description ||
    //   //   !honorName ||
    //   !whatsApp ||
    //   !email
    // ) {
    //   throw new Error("All fields are required");
    // }
    // const requiredFiles = { image: false };
    // if (files) {
    //   files.forEach((file) => {
    //     if (requiredFiles.hasOwnProperty(file.fieldname)) {
    //       requiredFiles[file.fieldname] = true;
    //     }
    //   });
    // }

    // // Process image files if present
    // let image;
    // if (Array.isArray(files) && files.length > 0 && isMainThread) {
    //   // Map over the files and prepare them for upload
    //   const imgFile = files.map(
    //     ({ buffer, originalname, fieldname, mimetype }) => ({
    //       buffer,
    //       originalname:
    //         mimetype === "application/pdf"
    //           ? convertFileNameWithPdfExt(originalname)
    //           : convertFileNameWithWebpExt(originalname),
    //       fieldname,
    //       mimetype,
    //     })
    //   );

    //   console.log("imgFile", imgFile);

    //   // Handle the upload of each file
    //   for (let file of imgFile) {
    //     try {
    //       await uploadWorker(file); // Assuming uploadWorker can handle one file at a time
    //     } catch (error) {
    //       console.error("Error uploading file:", error);
    //       throw new Error("File upload failed");
    //     }
    //   }

    //   // After upload, convert imgFile array to object format
    //   image = convertImgArrayToObject(imgFile);
    // } else {
    //   throw new Error("Invalid or empty files array");
    // }

    // // Update payload with new image paths
    // if (image) {
    //   Object.assign(payload, image);
    // }

    // Update the database with the new data
    const paymentServiceConfigData =
      await this.#repository.updatePaymentServiceConfig(id, payload);

    // Remove old files if they’re being replaced
    // if (paymentServiceConfigData) {
    //   const filesToRemove = [
    //     requiredFiles.image ? paymentServiceConfigData.image : null,
    //   ].filter(Boolean);

    //   for (const filePath of filesToRemove) {
    //     await removeUploadFile(filePath);
    //   }
    // }

    return paymentServiceConfigData;
  }

  async updatePaymentServiceConfigStatus(id, status) {
    if (!status) throw new NotFoundError("Status is required");
    status = status === "true";
    const paymentServiceConfig =
      await this.#repository.updatePaymentServiceConfigStatus(id, {
        status: status,
      });
    console.log("paymentServiceConfig", paymentServiceConfig);
    if (!paymentServiceConfig)
      throw new NotFoundError("PaymentServiceConfig not found");
    return paymentServiceConfig;
  }

  async deletePaymentServiceConfig(id) {
    const paymentServiceConfig = await this.#repository.findById(id);
    if (!paymentServiceConfig)
      throw new NotFoundError("PaymentServiceConfig not found");
    const deletedPaymentServiceConfig = await this.#repository.deleteById(id);
    console.log("paymentServiceConfig", paymentServiceConfig);
    if (deletedPaymentServiceConfig) {
      await removeUploadFile(paymentServiceConfig?.image);
    }
    return deletedPaymentServiceConfig;
  }
}

module.exports = new PaymentServiceConfigService(
  paymentServiceConfigRepository,
  "paymentServiceConfig"
);

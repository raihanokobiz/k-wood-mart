require("dotenv/config");

const {
  PORT,
  HOST,
  MONGO_CONNECTION_STRING,
  MONGO_PASSWORD,
  JWT_ACCESS_SECRET_KEY,
  JWT_REFRESH_SECRET_KEY,
  UPLOAD_FOLDER,
  UPLOAD_PATH,
  CLIENT_BASE_URL,
} = process.env;

const config = {
  port: PORT,
  host: HOST,
  databaseUrl: MONGO_CONNECTION_STRING,
  databasePassword: MONGO_PASSWORD,
  jwtAccessSecretKey: JWT_ACCESS_SECRET_KEY,
  jwtRefreshSecretKey: JWT_REFRESH_SECRET_KEY,
  uploadFolder: UPLOAD_FOLDER,
  uploadPath: UPLOAD_PATH,
  clientBaseURL: CLIENT_BASE_URL,
};

module.exports = config;

require("dotenv").config();

const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_AUTH_TOKEN: process.env.JWT_AUTH_TOKEN,
    SALT_ROUND: process.env.SALT_ROUND,
    MONGO_PROJECT_ID:process.env.MONGO_PROJECT_ID,
    MONGO_BUCKET_NAME:process.env.MONGO_BUCKET_NAME,
};

module.exports = config;
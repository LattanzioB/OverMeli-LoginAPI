const {
    DB_USER,
    DB_PASSWORD,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    MONGO_URL_RW,
    MONGO_URL,
    MONGO_CURL,
    PORT
  } = process.env;
  
  const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`;
  const clurl = MONGO_CURL
  
  const rwurl = MONGO_URL_RW
  const port = PORT || 8000

  module.exports = {
    url,
    rwurl,
    clurl,
    port
  };
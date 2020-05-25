/**
 * puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * entorno (producción o desarrollo)
 */
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * cadena conexión MongoDB
 */
process.env.URL_MONGODB =
    process.env.NODE_ENV === "dev" ?
    "mongodb://localhost:27017/cafe" :
    process.env.MONGO_URL;
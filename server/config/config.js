/**
 * puerto
 */
process.env.PORT = process.env.PORT || 3000;

/**
 * entorno (producción o desarrollo)
 */
process.env.NODE_ENV = process.env.NODE_ENV || "dev";

/**
 * Vencimiento del token
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 días
 */

process.env.EXPIRATION_TOKEN = "48h";

/**
 * SEED de autenticación
 */
process.env.SEED = process.env.SEED || "este-es-el-seed-desarrollo";

/**
 * cadena conexión MongoDB
 */
process.env.URL_MONGODB =
    process.env.NODE_ENV === "dev" ?
    "mongodb://localhost:27017/cafe" :
    process.env.MONGO_URL;

/**
 * google client ID
 */
process.env.CLIENT_ID =
    process.env.CLIENT_ID ||
    "558451916625-g4cfqq3rp3sjp1ijocsh8j62jql26inc.apps.googleusercontent.com";
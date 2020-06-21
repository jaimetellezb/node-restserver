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

process.env.EXPIRATION_TOKEN = 60 * 60 * 24 * 30;

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
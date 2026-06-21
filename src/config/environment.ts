import "dotenv/config"
import { buildDatabaseConfig } from "./database.js"
import {
    buildAuthConfig,
    buildCorsConfig,
    buildCspConfig,
    buildHealthcheckConfig,
    buildOpenApiAuthConfig,
} from "./http.js"
import { buildMailerConfig } from "./mailer.js"
import { parseNumber } from "./parsers.js"
import { buildStorageConfig } from "./storage.js"
import { buildSwaggerConfig } from "./swagger.js"
import type { AppConfig } from "./types.js"

const config: AppConfig = {
    host: process.env.HOST || "0.0.0.0",
    port: parseNumber(process.env.PORT, 3000),
    isDevEnvironment: process.env.NODE_ENV === "development",
    keepAliveTimeout: parseNumber(process.env.SERVER_KEEP_ALIVE_TIMEOUT, 60000),
    requestTimeout: parseNumber(process.env.SERVER_REQUEST_TIMEOUT, 30000),
    bodyLimit: parseNumber(process.env.SERVER_BODY_LIMIT, 5 * 1024 * 1024),
    auth: buildAuthConfig(process.env),
    cors: buildCorsConfig(),
    csp: buildCspConfig(),
    database: buildDatabaseConfig(process.env),
    storage: buildStorageConfig(process.env),
    healthcheck: buildHealthcheckConfig(process.env),
    mailer: buildMailerConfig(process.env),
    swagger: buildSwaggerConfig(),
    captcha: {
        secret: process.env.TURNSTILE_SECRET_KEY,
    },
    openapi: buildOpenApiAuthConfig(process.env),
}

export default config as Readonly<AppConfig>
export type { AppConfig } from "./types.js"

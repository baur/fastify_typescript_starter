import type { FastifyInstance } from "fastify"
import { parseDecimal, parseNumber } from "./parsers.js"
import type { AppConfig, AuthConfig, OpenApiAuthConfig } from "./types.js"

export const buildAuthConfig = (env: NodeJS.ProcessEnv): AuthConfig => ({
    accessTokenExpiresInSeconds: parseNumber(env.ADMIN_ACCESS_TOKEN_EXPIRES_SECONDS, 24 * 60 * 60),
    privateKeyBase64: env.JWT_PRIVATE_KEY || "",
    publicKeyBase64: env.JWT_PUBLIC_KEY || "",
})

export const buildCorsConfig = (): AppConfig["cors"] => ({
    origin: [],
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Origin",
        "User-Agent",
        "X-Requested-With",
        "If-Modified-Since",
        "Cache-Control",
        "Range",
    ],
    credentials: true,
})

export const buildCspConfig = (): AppConfig["csp"] => ({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'none'"],
        styleSrc: ["'none'"],
        fontSrc: ["'none'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'none'"],
        frameSrc: ["'none'"],
    },
})

export const buildHealthcheckConfig = (env: NodeJS.ProcessEnv): AppConfig["healthcheck"] => ({
    maxEventLoopDelay: parseNumber(env.MAX_EVENT_LOOP_DELAY, 1000),
    maxEventLoopUtilization: parseDecimal(env.MAX_EVENT_LOOP_UTILIZATION, 0.9),
    message: env.UNDER_PRESSURE_MESSAGE || "Server under pressure!",
    retryAfter: parseNumber(env.RETRY_AFTER, 60),
    exposeStatusRoute: {
        routeOpts: {},
        routeResponseSchemaOpts: {
            metrics: {
                type: "object",
                properties: {
                    eventLoopDelay: { type: "number" },
                    eventLoopUtilized: { type: "number" },
                    rssBytes: { type: "number" },
                    heapUsed: { type: "number" },
                },
            },
        },
    },
    healthCheck: async (app: FastifyInstance) => ({
        metrics: app.memoryUsage(),
    }),
})

export const buildOpenApiAuthConfig = (env: NodeJS.ProcessEnv): OpenApiAuthConfig => ({
    user: env.OPENAPI_USER || "root",
    pass: env.OPENAPI_PASS || "root",
})

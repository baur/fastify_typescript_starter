import type { FastifyCorsOptions } from "@fastify/cors"
import type { FastifyMultipartBaseOptions } from "@fastify/multipart"
import type { SwaggerOptions } from "@fastify/swagger"
import type { FastifyUnderPressureOptions } from "@fastify/under-pressure"
import type { ClientOptions } from "minio"
import type { SendMailOptions, TransportOptions } from "nodemailer"
import type { PoolConfig } from "pg"
import type { ConstructorOptions } from "pg-boss"

export interface StorageConfig {
    multer: FastifyMultipartBaseOptions["limits"]
    connection: ClientOptions
    publicBaseUrl: string
    bucket?: string
}

export interface MailerConfig {
    defaults: Partial<SendMailOptions>
    transport: TransportOptions
}

export interface AuthConfig {
    accessTokenExpiresInSeconds: number
    privateKeyBase64: string
    publicKeyBase64: string
}

export interface OpenApiAuthConfig {
    user: string
    pass: string
}

export interface DatabaseConfig {
    pool: PoolConfig
    queue: ConstructorOptions & Record<string, unknown>
    timezone: string
}

export interface AppConfig {
    host: string
    port: number
    isDevEnvironment: boolean
    keepAliveTimeout: number
    requestTimeout: number
    bodyLimit: number
    auth: AuthConfig
    cors: FastifyCorsOptions
    csp: {
        directives: {
            defaultSrc: string[]
            scriptSrc: string[]
            styleSrc: string[]
            fontSrc: string[]
            imgSrc: string[]
            connectSrc: string[]
            objectSrc: string[]
            mediaSrc: string[]
            frameSrc: string[]
        }
    }
    database: DatabaseConfig
    storage: StorageConfig
    healthcheck: FastifyUnderPressureOptions
    mailer: MailerConfig
    swagger: SwaggerOptions
    captcha: {
        secret?: string
    }
    openapi: OpenApiAuthConfig
}

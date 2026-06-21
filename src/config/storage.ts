import type { StorageConfig } from "./types.js"

const parseStorageConnection = (env: NodeJS.ProcessEnv): Pick<StorageConfig, "connection" | "publicBaseUrl"> => {
    const rawEndpoint = env.S3_ENDPOINT?.trim().length ? env.S3_ENDPOINT.trim() : "http://localhost:9000"
    const normalizedEndpoint = rawEndpoint.includes("://") ? rawEndpoint : `http://${rawEndpoint}`
    const parsedEndpoint = new URL(normalizedEndpoint)
    const useSSL = parsedEndpoint.protocol === "https:"
    const port = parsedEndpoint.port ? Number(parsedEndpoint.port) : useSSL ? 443 : 80

    return {
        connection: {
            endPoint: parsedEndpoint.hostname,
            port,
            useSSL,
            region: env.S3_REGION || "us-east-1",
            accessKey: env.S3_ACCESS_KEY || "",
            secretKey: env.S3_SECRET_PASSWORD || "",
            pathStyle: true,
        },
        publicBaseUrl: `${useSSL ? "https" : "http"}://${parsedEndpoint.hostname}${parsedEndpoint.port ? `:${parsedEndpoint.port}` : ""}`,
    }
}

export const buildStorageConfig = (env: NodeJS.ProcessEnv): StorageConfig => {
    const storageConnection = parseStorageConnection(env)

    return {
        multer: {
            fieldNameSize: 100,
            fieldSize: 100,
            fields: 2,
            fileSize: 1_000_000,
            files: 1,
        },
        connection: storageConnection.connection,
        publicBaseUrl: storageConnection.publicBaseUrl,
        bucket: env.S3_BUCKET,
    }
}

import type { SwaggerOptions } from "@fastify/swagger"

export const buildSwaggerConfig = (): SwaggerOptions => ({
    openapi: {
        openapi: "3.1.0",
        info: {
            title: "Fastify TypeScript Starter API",
            description: "API documentation for the starter backend",
            version: "2.0.0",
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Development server",
            },
        ],
        security: [{ bearerAuth: [] }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                    description: "Enter JWT Bearer token only",
                },
            },
        },
    },
    refResolver: {
        buildLocalReference(json, _baseUri, fragment, i) {
            if (typeof json.$id === "string") return json.$id
            if (typeof json.title === "string") return json.title
            if (fragment) {
                const name = fragment.split("/").pop()
                if (name && name !== "properties" && name !== "items") {
                    return `${name}${i}`
                }
            }
            return `AutoSchema${i}`
        },
    },
})

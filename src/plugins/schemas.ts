import type { FastifyInstance } from "fastify"
import fp from "fastify-plugin"
import { models as authModels } from "#app/auth/schema.js"
import { models as baseModels } from "#app/base/schema.js"
import { models as galleryModels } from "#app/gallery/schema.js"
import { models as plantModels } from "#app/plants/schema.js"
import { models as configModels } from "#config/schema.js"

type SchemaJson = {
    $id?: string
    title?: string
    [key: string]: unknown
}

export const allModels: readonly unknown[] = [
    ...configModels,
    ...authModels,
    ...baseModels,
    ...galleryModels,
    ...plantModels,
]

const isSchemaJson = (value: unknown): value is SchemaJson => typeof value === "object" && value !== null

const hasSchemaMethod = (value: unknown, method: "toJSON" | "valueOf"): value is Record<typeof method, () => unknown> =>
    isSchemaJson(value) && typeof value[method] === "function"

const schemaJsonFromModel = (model: unknown, index: number): SchemaJson => {
    const json = hasSchemaMethod(model, "toJSON")
        ? model.toJSON()
        : hasSchemaMethod(model, "valueOf")
          ? model.valueOf()
          : model

    if (!isSchemaJson(json)) {
        throw new Error(`Schema model at registry index ${index} did not resolve to an object.`)
    }

    return json
}

async function registerSchemas(fastify: FastifyInstance) {
    const registeredIds = new Set<string>()

    for (const [index, model] of allModels.entries()) {
        const json = schemaJsonFromModel(model, index)
        const schemaId = json.$id

        if (!schemaId) {
            throw new Error(`Schema model at registry index ${index} is missing "$id".`)
        }
        if (registeredIds.has(schemaId)) {
            throw new Error(`Duplicate schema id "${schemaId}" found in schema registry.`)
        }
        if (!json.title) {
            json.title = schemaId
        }

        fastify.addSchema(json)
        registeredIds.add(schemaId)
    }
}

export default fp(registerSchemas, {
    fastify: ">=5.0.0",
    name: "schemas",
})

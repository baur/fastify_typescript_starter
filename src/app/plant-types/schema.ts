import type { FastifySchema } from "fastify"
import { Type } from "typebox"

const replySchema = (data?: object) => ({
    type: "object",
    properties: {
        error: { type: "boolean" },
        message: { type: "string" },
        ...(data ? { data } : {}),
    },
    required: ["error", "message"],
})

const errorResponseSchema = {
    type: "object",
    properties: {
        statusCode: { type: "integer" },
        error: { type: "string" },
        message: { type: "string" },
    },
    required: ["statusCode", "error", "message"],
}

const commonErrorResponses = {
    400: errorResponseSchema,
    404: errorResponseSchema,
    409: errorResponseSchema,
}

export namespace Data {
    export const plantType = Type.Object(
        {
            plant_type_id: Type.Integer({ minimum: 1 }),
            plant_type_name: Type.String({ minLength: 1 }),
            created_at: Type.String({ format: "date-time" }),
            updated_at: Type.String({ format: "date-time" }),
        },
        { $id: "PlantType", additionalProperties: false },
    )

    export const plantTypeList = Type.Object(
        {
            items: Type.Array({ $ref: "PlantType#" }),
        },
        { $id: "PlantTypeList", additionalProperties: false },
    )

    export const plantTypeIdParams = Type.Object(
        {
            plant_type_id: Type.Integer({ minimum: 1 }),
        },
        { $id: "PlantTypeIdParams", additionalProperties: false },
    )

    export const createPlantTypeBody = Type.Object(
        {
            plant_type_name: Type.String({ minLength: 1 }),
        },
        { $id: "PlantTypeCreateBody", additionalProperties: false },
    )

    export const updatePlantTypeBody = Type.Object(
        {
            plant_type_name: Type.Optional(Type.String({ minLength: 1 })),
        },
        { $id: "PlantTypeUpdateBody", additionalProperties: false, minProperties: 1 },
    )
}

export const models = [
    Data.plantType,
    Data.plantTypeList,
    Data.plantTypeIdParams,
    Data.createPlantTypeBody,
    Data.updatePlantTypeBody,
]

export namespace RouteSchema {
    export const list: FastifySchema = {
        description: "List plant types",
        tags: ["plant-types"],
        response: { 200: replySchema({ $ref: "PlantTypeList#" }), ...commonErrorResponses },
    }

    export const get: FastifySchema = {
        description: "Get plant type by id",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        response: { 200: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const create: FastifySchema = {
        description: "Create plant type",
        tags: ["plant-types"],
        body: Data.createPlantTypeBody,
        response: { 201: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const update: FastifySchema = {
        description: "Update plant type",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        body: Data.updatePlantTypeBody,
        response: { 200: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const destroy: FastifySchema = {
        description: "Delete plant type",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        response: { 204: { type: "null" }, ...commonErrorResponses },
    }
}

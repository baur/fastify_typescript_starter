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
    export const plant = Type.Object(
        {
            plant_id: Type.Integer({ minimum: 1 }),
            plant_type_id: Type.Integer({ minimum: 1 }),
            plant_name: Type.String({ minLength: 1 }),
            plant_id_parent: Type.Union([Type.Null(), Type.Integer({ minimum: 1 })]),
            created_at: Type.String({ format: "date-time" }),
            updated_at: Type.String({ format: "date-time" }),
        },
        { $id: "Plant", additionalProperties: false },
    )

    export const plantList = Type.Object(
        {
            items: Type.Array({ $ref: "Plant#" }),
        },
        { $id: "PlantList", additionalProperties: false },
    )

    export const plantIdParams = Type.Object(
        {
            plant_id: Type.Integer({ minimum: 1 }),
        },
        { $id: "PlantIdParams", additionalProperties: false },
    )

    export const createPlantBody = Type.Object(
        {
            plant_type_id: Type.Integer({ minimum: 1 }),
            plant_name: Type.String({ minLength: 1 }),
            plant_id_parent: Type.Optional(Type.Union([Type.Null(), Type.Integer({ minimum: 1 })])),
        },
        { $id: "PlantCreateBody", additionalProperties: false },
    )

    export const updatePlantBody = Type.Object(
        {
            plant_type_id: Type.Optional(Type.Integer({ minimum: 1 })),
            plant_name: Type.Optional(Type.String({ minLength: 1 })),
            plant_id_parent: Type.Optional(Type.Union([Type.Null(), Type.Integer({ minimum: 1 })])),
        },
        { $id: "PlantUpdateBody", additionalProperties: false, minProperties: 1 },
    )
}

export const models = [Data.plant, Data.plantList, Data.plantIdParams, Data.createPlantBody, Data.updatePlantBody]

export namespace RouteSchema {
    export const list: FastifySchema = {
        description: "List plants",
        tags: ["plants"],
        response: { 200: replySchema({ $ref: "PlantList#" }), ...commonErrorResponses },
    }

    export const get: FastifySchema = {
        description: "Get plant by id",
        tags: ["plants"],
        params: Data.plantIdParams,
        response: { 200: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const create: FastifySchema = {
        description: "Create plant",
        tags: ["plants"],
        body: Data.createPlantBody,
        response: { 201: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const update: FastifySchema = {
        description: "Update plant",
        tags: ["plants"],
        params: Data.plantIdParams,
        body: Data.updatePlantBody,
        response: { 200: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const destroy: FastifySchema = {
        description: "Delete plant",
        tags: ["plants"],
        params: Data.plantIdParams,
        response: { 204: { type: "null" }, ...commonErrorResponses },
    }
}

import type { FastifySchema } from "fastify"
import { Type } from "typebox"

const idParam = (idKey: "plant_type_id" | "plant_id", schemaId: string) =>
    Type.Object(
        {
            [idKey]: Type.Integer({ minimum: 1 }),
        },
        { $id: schemaId, additionalProperties: false },
    )

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

    export const plantTypeList = Type.Object(
        {
            items: Type.Array({ $ref: "PlantType#" }),
        },
        { $id: "PlantTypeList", additionalProperties: false },
    )

    export const plantList = Type.Object(
        {
            items: Type.Array({ $ref: "Plant#" }),
        },
        { $id: "PlantList", additionalProperties: false },
    )

    export const plantTypeIdParams = idParam("plant_type_id", "PlantTypeIdParams")
    export const plantIdParams = idParam("plant_id", "PlantIdParams")

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

export const models = [
    Data.plantType,
    Data.plant,
    Data.plantTypeList,
    Data.plantList,
    Data.plantTypeIdParams,
    Data.plantIdParams,
    Data.createPlantTypeBody,
    Data.updatePlantTypeBody,
    Data.createPlantBody,
    Data.updatePlantBody,
]

export namespace RouteSchema {
    export const listPlantTypes: FastifySchema = {
        description: "List plant types",
        tags: ["plant-types"],
        response: { 200: replySchema({ $ref: "PlantTypeList#" }), ...commonErrorResponses },
    }

    export const getPlantType: FastifySchema = {
        description: "Get plant type by id",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        response: { 200: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const createPlantType: FastifySchema = {
        description: "Create plant type",
        tags: ["plant-types"],
        body: Data.createPlantTypeBody,
        response: { 201: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const updatePlantType: FastifySchema = {
        description: "Update plant type",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        body: Data.updatePlantTypeBody,
        response: { 200: replySchema({ $ref: "PlantType#" }), ...commonErrorResponses },
    }

    export const deletePlantType: FastifySchema = {
        description: "Delete plant type",
        tags: ["plant-types"],
        params: Data.plantTypeIdParams,
        response: { 204: { type: "null" }, ...commonErrorResponses },
    }

    export const listPlants: FastifySchema = {
        description: "List plants",
        tags: ["plants"],
        response: { 200: replySchema({ $ref: "PlantList#" }), ...commonErrorResponses },
    }

    export const getPlant: FastifySchema = {
        description: "Get plant by id",
        tags: ["plants"],
        params: Data.plantIdParams,
        response: { 200: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const createPlant: FastifySchema = {
        description: "Create plant",
        tags: ["plants"],
        body: Data.createPlantBody,
        response: { 201: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const updatePlant: FastifySchema = {
        description: "Update plant",
        tags: ["plants"],
        params: Data.plantIdParams,
        body: Data.updatePlantBody,
        response: { 200: replySchema({ $ref: "Plant#" }), ...commonErrorResponses },
    }

    export const deletePlant: FastifySchema = {
        description: "Delete plant",
        tags: ["plants"],
        params: Data.plantIdParams,
        response: { 204: { type: "null" }, ...commonErrorResponses },
    }
}

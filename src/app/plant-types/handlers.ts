import type { FastifyReply, FastifyRequest } from "fastify"
import type PlantTypeService from "./service.js"
import type { CreatePlantTypeBody, PlantTypeIdParams, UpdatePlantTypeBody } from "./types.js"

class PlantTypeHandler {
    constructor(private readonly svc: PlantTypeService) {}

    public list = async (_req: FastifyRequest, reply: FastifyReply) => {
        const items = await this.svc.list()

        reply.code(200)
        return {
            error: false,
            message: "Plant types fetched",
            data: { items },
        }
    }

    public get = async (req: FastifyRequest<{ Params: PlantTypeIdParams }>, reply: FastifyReply) => {
        const data = await this.svc.get(req.params.plant_type_id)

        reply.code(200)
        return {
            error: false,
            message: "Plant type fetched",
            data,
        }
    }

    public create = async (req: FastifyRequest<{ Body: CreatePlantTypeBody }>, reply: FastifyReply) => {
        const data = await this.svc.create(req.body)

        reply.code(201)
        return {
            error: false,
            message: "Plant type created",
            data,
        }
    }

    public update = async (
        req: FastifyRequest<{ Params: PlantTypeIdParams; Body: UpdatePlantTypeBody }>,
        reply: FastifyReply,
    ) => {
        const data = await this.svc.update(req.params.plant_type_id, req.body)

        reply.code(200)
        return {
            error: false,
            message: "Plant type updated",
            data,
        }
    }

    public delete = async (req: FastifyRequest<{ Params: PlantTypeIdParams }>, reply: FastifyReply) => {
        await this.svc.delete(req.params.plant_type_id)

        reply.code(204)
        return null
    }
}

export default PlantTypeHandler

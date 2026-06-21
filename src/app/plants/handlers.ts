import type { FastifyReply, FastifyRequest } from "fastify"
import type PlantService from "./service.js"
import type { CreatePlantBody, PlantIdParams, UpdatePlantBody } from "./types.js"

class PlantHandler {
    constructor(private readonly svc: PlantService) {}

    public list = async (_req: FastifyRequest, reply: FastifyReply) => {
        const items = await this.svc.list()

        reply.code(200)
        return {
            error: false,
            message: "Plants fetched",
            data: { items },
        }
    }

    public get = async (req: FastifyRequest<{ Params: PlantIdParams }>, reply: FastifyReply) => {
        const data = await this.svc.get(req.params.plant_id)

        reply.code(200)
        return {
            error: false,
            message: "Plant fetched",
            data,
        }
    }

    public create = async (req: FastifyRequest<{ Body: CreatePlantBody }>, reply: FastifyReply) => {
        const data = await this.svc.create(req.body)

        reply.code(201)
        return {
            error: false,
            message: "Plant created",
            data,
        }
    }

    public update = async (
        req: FastifyRequest<{ Params: PlantIdParams; Body: UpdatePlantBody }>,
        reply: FastifyReply,
    ) => {
        const data = await this.svc.update(req.params.plant_id, req.body)

        reply.code(200)
        return {
            error: false,
            message: "Plant updated",
            data,
        }
    }

    public delete = async (req: FastifyRequest<{ Params: PlantIdParams }>, reply: FastifyReply) => {
        await this.svc.delete(req.params.plant_id)

        reply.code(204)
        return null
    }
}

export default PlantHandler

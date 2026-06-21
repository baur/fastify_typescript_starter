import type { FastifyReply, FastifyRequest } from "fastify"
import type PlantService from "./service.js"
import type {
    CreatePlantBody,
    CreatePlantTypeBody,
    PlantIdParams,
    PlantTypeIdParams,
    UpdatePlantBody,
    UpdatePlantTypeBody,
} from "./types.js"

class PlantHandler {
    constructor(private readonly svc: PlantService) {}

    public listPlantTypes = async (_req: FastifyRequest, reply: FastifyReply) => {
        const items = await this.svc.listPlantTypes()

        reply.code(200)
        return {
            error: false,
            message: "Plant types fetched",
            data: { items },
        }
    }

    public getPlantType = async (req: FastifyRequest<{ Params: PlantTypeIdParams }>, reply: FastifyReply) => {
        const data = await this.svc.getPlantType(req.params.plant_type_id)

        reply.code(200)
        return {
            error: false,
            message: "Plant type fetched",
            data,
        }
    }

    public createPlantType = async (req: FastifyRequest<{ Body: CreatePlantTypeBody }>, reply: FastifyReply) => {
        const data = await this.svc.createPlantType(req.body)

        reply.code(201)
        return {
            error: false,
            message: "Plant type created",
            data,
        }
    }

    public updatePlantType = async (
        req: FastifyRequest<{ Params: PlantTypeIdParams; Body: UpdatePlantTypeBody }>,
        reply: FastifyReply,
    ) => {
        const data = await this.svc.updatePlantType(req.params.plant_type_id, req.body)

        reply.code(200)
        return {
            error: false,
            message: "Plant type updated",
            data,
        }
    }

    public deletePlantType = async (req: FastifyRequest<{ Params: PlantTypeIdParams }>, reply: FastifyReply) => {
        await this.svc.deletePlantType(req.params.plant_type_id)

        reply.code(204)
        return null
    }

    public listPlants = async (_req: FastifyRequest, reply: FastifyReply) => {
        const items = await this.svc.listPlants()

        reply.code(200)
        return {
            error: false,
            message: "Plants fetched",
            data: { items },
        }
    }

    public getPlant = async (req: FastifyRequest<{ Params: PlantIdParams }>, reply: FastifyReply) => {
        const data = await this.svc.getPlant(req.params.plant_id)

        reply.code(200)
        return {
            error: false,
            message: "Plant fetched",
            data,
        }
    }

    public createPlant = async (req: FastifyRequest<{ Body: CreatePlantBody }>, reply: FastifyReply) => {
        const data = await this.svc.createPlant(req.body)

        reply.code(201)
        return {
            error: false,
            message: "Plant created",
            data,
        }
    }

    public updatePlant = async (
        req: FastifyRequest<{ Params: PlantIdParams; Body: UpdatePlantBody }>,
        reply: FastifyReply,
    ) => {
        const data = await this.svc.updatePlant(req.params.plant_id, req.body)

        reply.code(200)
        return {
            error: false,
            message: "Plant updated",
            data,
        }
    }

    public deletePlant = async (req: FastifyRequest<{ Params: PlantIdParams }>, reply: FastifyReply) => {
        await this.svc.deletePlant(req.params.plant_id)

        reply.code(204)
        return null
    }
}

export default PlantHandler

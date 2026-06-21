import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import PlantHandler from "./handlers.js"
import PlantRepository from "./repository.js"
import { RouteSchema } from "./schema.js"
import PlantService from "./service.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    const repo = new PlantRepository(app.db)
    const svc = new PlantService(app, repo)
    const handler = new PlantHandler(svc)

    app.route({
        method: "GET",
        url: "/plant-types",
        schema: RouteSchema.listPlantTypes,
        handler: handler.listPlantTypes,
    })

    app.route({
        method: "GET",
        url: "/plant-types/:plant_type_id",
        schema: RouteSchema.getPlantType,
        handler: handler.getPlantType,
    })

    app.route({
        method: "POST",
        url: "/plant-types",
        schema: RouteSchema.createPlantType,
        handler: handler.createPlantType,
    })

    app.route({
        method: "PATCH",
        url: "/plant-types/:plant_type_id",
        schema: RouteSchema.updatePlantType,
        handler: handler.updatePlantType,
    })

    app.route({
        method: "DELETE",
        url: "/plant-types/:plant_type_id",
        schema: RouteSchema.deletePlantType,
        handler: handler.deletePlantType,
    })

    app.route({
        method: "GET",
        url: "/plants",
        schema: RouteSchema.listPlants,
        handler: handler.listPlants,
    })

    app.route({
        method: "GET",
        url: "/plants/:plant_id",
        schema: RouteSchema.getPlant,
        handler: handler.getPlant,
    })

    app.route({
        method: "POST",
        url: "/plants",
        schema: RouteSchema.createPlant,
        handler: handler.createPlant,
    })

    app.route({
        method: "PATCH",
        url: "/plants/:plant_id",
        schema: RouteSchema.updatePlant,
        handler: handler.updatePlant,
    })

    app.route({
        method: "DELETE",
        url: "/plants/:plant_id",
        schema: RouteSchema.deletePlant,
        handler: handler.deletePlant,
    })
}

export default routes

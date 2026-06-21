import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import PlantTypeHandler from "./handlers.js"
import PlantTypeRepository from "./repository.js"
import { RouteSchema } from "./schema.js"
import PlantTypeService from "./service.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    const repo = new PlantTypeRepository(app.db)
    const svc = new PlantTypeService(app, repo)
    const handler = new PlantTypeHandler(svc)

    app.route({
        method: "GET",
        url: "/",
        schema: RouteSchema.list,
        handler: handler.list,
    })

    app.route({
        method: "GET",
        url: "/:plant_type_id",
        schema: RouteSchema.get,
        handler: handler.get,
    })

    app.route({
        method: "POST",
        url: "/",
        schema: RouteSchema.create,
        handler: handler.create,
    })

    app.route({
        method: "PATCH",
        url: "/:plant_type_id",
        schema: RouteSchema.update,
        handler: handler.update,
    })

    app.route({
        method: "DELETE",
        url: "/:plant_type_id",
        schema: RouteSchema.destroy,
        handler: handler.delete,
    })
}

export default routes

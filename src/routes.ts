import type { FastifyInstance, FastifyPluginAsync } from "fastify"
import authRoutes from "#app/auth/routes.js"
import rootRoutes from "#app/base/routes.js"
import galleryRoutes from "#app/gallery/routes.js"
import plantTypeRoutes from "#app/plant-types/routes.js"
import plantRoutes from "#app/plants/routes.js"

const routes: FastifyPluginAsync = async (app: FastifyInstance) => {
    await app.setNotFoundHandler((_request, reply) => {
        reply.code(404).send({ error: true, message: "404 - Route Not Found" })
    })

    await app.register(rootRoutes)
    await app.register(authRoutes, { prefix: "/v1/auth" })
    await app.register(galleryRoutes, { prefix: "/v1/gallery" })
    await app.register(plantTypeRoutes, { prefix: "/v1/plant-types" })
    await app.register(plantRoutes, { prefix: "/v1/plants" })
}

export default routes

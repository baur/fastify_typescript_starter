import assert from "node:assert/strict"
import { after, before, test } from "node:test"
import type { FastifyInstance } from "fastify"
import { createServer } from "../../server.js"

type ReplyEnvelope<T> = {
    error: boolean
    message: string
    data: T
}

type PlantTypePayload = {
    plant_type_id: number
    plant_type_name: string
}

type PlantPayload = {
    plant_id: number
    plant_type_id: number
    plant_name: string
    plant_id_parent: number | null
}

let app: FastifyInstance
const testRunId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
const plantTypeName = `Smoke Plant Type ${testRunId}`
const plantName = `Smoke Plant ${testRunId}`

before(async () => {
    app = await createServer()
})

after(async () => {
    if (!app) {
        return
    }

    await app.db.deleteFrom("dim_plant").where("plant_name", "=", plantName).execute()
    await app.db.deleteFrom("dim_plant_type").where("plant_type_name", "=", plantTypeName).execute()
    await app.close()
})

test("plant dimension CRUD routes can reach the database", async () => {
    const listTypesResponse = await app.inject({
        method: "GET",
        url: "/v1/plant-types",
    })
    assert.equal(listTypesResponse.statusCode, 200)
    assert.ok(listTypesResponse.body.length > 0)

    const createTypeResponse = await app.inject({
        method: "POST",
        url: "/v1/plant-types",
        payload: { plant_type_name: plantTypeName },
    })
    assert.equal(createTypeResponse.statusCode, 201)
    const createdType = createTypeResponse.json<ReplyEnvelope<PlantTypePayload>>().data
    assert.ok(createdType.plant_type_id > 0)

    const getTypeResponse = await app.inject({
        method: "GET",
        url: `/v1/plant-types/${createdType.plant_type_id}`,
    })
    assert.equal(getTypeResponse.statusCode, 200)
    assert.ok(getTypeResponse.body.length > 0)

    const createPlantResponse = await app.inject({
        method: "POST",
        url: "/v1/plants",
        payload: {
            plant_type_id: createdType.plant_type_id,
            plant_name: plantName,
            plant_id_parent: null,
        },
    })
    assert.equal(createPlantResponse.statusCode, 201)
    const createdPlant = createPlantResponse.json<ReplyEnvelope<PlantPayload>>().data
    assert.ok(createdPlant.plant_id > 0)

    const listPlantsResponse = await app.inject({
        method: "GET",
        url: "/v1/plants",
    })
    assert.equal(listPlantsResponse.statusCode, 200)
    assert.ok(listPlantsResponse.body.length > 0)

    const updatePlantResponse = await app.inject({
        method: "PATCH",
        url: `/v1/plants/${createdPlant.plant_id}`,
        payload: { plant_id_parent: null },
    })
    assert.equal(updatePlantResponse.statusCode, 200)
    assert.ok(updatePlantResponse.body.length > 0)

    const deletePlantResponse = await app.inject({
        method: "DELETE",
        url: `/v1/plants/${createdPlant.plant_id}`,
    })
    assert.equal(deletePlantResponse.statusCode, 204)

    const deleteTypeResponse = await app.inject({
        method: "DELETE",
        url: `/v1/plant-types/${createdType.plant_type_id}`,
    })
    assert.equal(deleteTypeResponse.statusCode, 204)
})

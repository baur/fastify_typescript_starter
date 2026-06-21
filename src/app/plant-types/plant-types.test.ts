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

let app: FastifyInstance | undefined
const testRunId = `${Date.now()}-${Math.random().toString(16).slice(2)}`
const plantTypeName = `Smoke Plant Type ${testRunId}`

after(async () => {
    if (!app) {
        return
    }

    await app.db.deleteFrom("dim_plant_type").where("plant_type_name", "=", plantTypeName).execute()
    await app.close()
})

before(async () => {
    app = await createServer()
})

test("plant type CRUD routes can reach the database", async () => {
    assert.ok(app)

    const listResponse = await app.inject({
        method: "GET",
        url: "/v1/plant-types",
    })
    assert.equal(listResponse.statusCode, 200)
    assert.ok(listResponse.body.length > 0)

    const createResponse = await app.inject({
        method: "POST",
        url: "/v1/plant-types",
        payload: { plant_type_name: plantTypeName },
    })
    assert.equal(createResponse.statusCode, 201)
    const created = createResponse.json<ReplyEnvelope<PlantTypePayload>>().data
    assert.ok(created.plant_type_id > 0)

    const getResponse = await app.inject({
        method: "GET",
        url: `/v1/plant-types/${created.plant_type_id}`,
    })
    assert.equal(getResponse.statusCode, 200)
    assert.ok(getResponse.body.length > 0)

    const updateResponse = await app.inject({
        method: "PATCH",
        url: `/v1/plant-types/${created.plant_type_id}`,
        payload: { plant_type_name: plantTypeName },
    })
    assert.equal(updateResponse.statusCode, 200)
    assert.ok(updateResponse.body.length > 0)

    const deleteResponse = await app.inject({
        method: "DELETE",
        url: `/v1/plant-types/${created.plant_type_id}`,
    })
    assert.equal(deleteResponse.statusCode, 204)
})

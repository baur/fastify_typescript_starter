import type { FastifyInstance } from "fastify"
import type PlantRepository from "./repository.js"
import type { PlantRow } from "./repository.js"
import type { CreatePlantBody, Plant, UpdatePlantBody } from "./types.js"

class PlantService {
    constructor(
        private readonly app: FastifyInstance,
        private readonly repo: PlantRepository,
    ) {}

    public async list(): Promise<Plant[]> {
        const rows = await this.repo.list()
        return rows.map(this.toPlant)
    }

    public async get(plantId: number): Promise<Plant> {
        const plant = await this.repo.getById(plantId)
        if (!plant) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        return this.toPlant(plant)
    }

    public async create(input: CreatePlantBody): Promise<Plant> {
        await this.ensurePlantTypeExists(input.plant_type_id)
        await this.ensurePlantNameIsAvailable(input.plant_name)

        if (input.plant_id_parent !== undefined && input.plant_id_parent !== null) {
            await this.ensurePlantExists(input.plant_id_parent)
        }

        const plant = await this.repo.create({
            plant_type_id: input.plant_type_id,
            plant_name: input.plant_name,
            plant_id_parent: input.plant_id_parent ?? null,
        })

        return this.toPlant(plant)
    }

    public async update(plantId: number, input: UpdatePlantBody): Promise<Plant> {
        const current = await this.repo.getById(plantId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        if (input.plant_type_id !== undefined) {
            await this.ensurePlantTypeExists(input.plant_type_id)
        }
        if (input.plant_name && input.plant_name !== current.plant_name) {
            await this.ensurePlantNameIsAvailable(input.plant_name)
        }
        if (input.plant_id_parent !== undefined && input.plant_id_parent !== null) {
            if (input.plant_id_parent === plantId) {
                throw this.app.httpErrors.badRequest("Plant cannot be its own parent")
            }
            await this.ensurePlantExists(input.plant_id_parent)
        }

        const updated = await this.repo.update(plantId, input)
        if (!updated) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        return this.toPlant(updated)
    }

    public async delete(plantId: number): Promise<void> {
        const current = await this.repo.getById(plantId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        await this.repo.delete(plantId)
    }

    private async ensurePlantTypeExists(plantTypeId: number): Promise<void> {
        const exists = await this.repo.plantTypeExists(plantTypeId)
        if (!exists) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }
    }

    private async ensurePlantExists(plantId: number): Promise<void> {
        const plant = await this.repo.getById(plantId)
        if (!plant) {
            throw this.app.httpErrors.notFound(`Parent plant ${plantId} not found`)
        }
    }

    private async ensurePlantNameIsAvailable(plantName: string): Promise<void> {
        const existing = await this.repo.getByName(plantName)
        if (existing) {
            throw this.app.httpErrors.conflict(`Plant "${plantName}" already exists`)
        }
    }

    private toPlant(row: PlantRow): Plant {
        return {
            plant_id: row.plant_id,
            plant_type_id: row.plant_type_id,
            plant_name: row.plant_name,
            plant_id_parent: row.plant_id_parent,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
        }
    }
}

export default PlantService

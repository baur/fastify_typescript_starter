import type { FastifyInstance } from "fastify"
import type PlantTypeRepository from "./repository.js"
import type { PlantTypeRow } from "./repository.js"
import type { CreatePlantTypeBody, PlantType, UpdatePlantTypeBody } from "./types.js"

class PlantTypeService {
    constructor(
        private readonly app: FastifyInstance,
        private readonly repo: PlantTypeRepository,
    ) {}

    public async list(): Promise<PlantType[]> {
        const rows = await this.repo.list()
        return rows.map(this.toPlantType)
    }

    public async get(plantTypeId: number): Promise<PlantType> {
        const plantType = await this.repo.getById(plantTypeId)
        if (!plantType) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        return this.toPlantType(plantType)
    }

    public async create(input: CreatePlantTypeBody): Promise<PlantType> {
        await this.ensureNameIsAvailable(input.plant_type_name)
        const plantType = await this.repo.create({ plant_type_name: input.plant_type_name })
        return this.toPlantType(plantType)
    }

    public async update(plantTypeId: number, input: UpdatePlantTypeBody): Promise<PlantType> {
        const current = await this.repo.getById(plantTypeId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        if (input.plant_type_name && input.plant_type_name !== current.plant_type_name) {
            await this.ensureNameIsAvailable(input.plant_type_name)
        }

        const updated = await this.repo.update(plantTypeId, input)
        if (!updated) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        return this.toPlantType(updated)
    }

    public async delete(plantTypeId: number): Promise<void> {
        const current = await this.repo.getById(plantTypeId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        const plantCount = await this.repo.countPlants(plantTypeId)
        if (plantCount > 0) {
            throw this.app.httpErrors.conflict(`Plant type ${plantTypeId} is used by plants`)
        }

        await this.repo.delete(plantTypeId)
    }

    private async ensureNameIsAvailable(plantTypeName: string): Promise<void> {
        const existing = await this.repo.getByName(plantTypeName)
        if (existing) {
            throw this.app.httpErrors.conflict(`Plant type "${plantTypeName}" already exists`)
        }
    }

    private toPlantType(row: PlantTypeRow): PlantType {
        return {
            plant_type_id: row.plant_type_id,
            plant_type_name: row.plant_type_name,
            created_at: row.created_at.toISOString(),
            updated_at: row.updated_at.toISOString(),
        }
    }
}

export default PlantTypeService

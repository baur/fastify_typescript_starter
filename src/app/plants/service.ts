import type { FastifyInstance } from "fastify"
import type PlantRepository from "./repository.js"
import type { PlantRow, PlantTypeRow } from "./repository.js"
import type {
    CreatePlantBody,
    CreatePlantTypeBody,
    Plant,
    PlantType,
    UpdatePlantBody,
    UpdatePlantTypeBody,
} from "./types.js"

class PlantService {
    constructor(
        private readonly app: FastifyInstance,
        private readonly repo: PlantRepository,
    ) {}

    public async listPlantTypes(): Promise<PlantType[]> {
        const rows = await this.repo.listPlantTypes()
        return rows.map(this.toPlantType)
    }

    public async getPlantType(plantTypeId: number): Promise<PlantType> {
        const plantType = await this.repo.getPlantTypeById(plantTypeId)
        if (!plantType) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        return this.toPlantType(plantType)
    }

    public async createPlantType(input: CreatePlantTypeBody): Promise<PlantType> {
        await this.ensurePlantTypeNameIsAvailable(input.plant_type_name)
        const plantType = await this.repo.createPlantType({ plant_type_name: input.plant_type_name })
        return this.toPlantType(plantType)
    }

    public async updatePlantType(plantTypeId: number, input: UpdatePlantTypeBody): Promise<PlantType> {
        const current = await this.repo.getPlantTypeById(plantTypeId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        if (input.plant_type_name && input.plant_type_name !== current.plant_type_name) {
            await this.ensurePlantTypeNameIsAvailable(input.plant_type_name)
        }

        const updated = await this.repo.updatePlantType(plantTypeId, input)
        if (!updated) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        return this.toPlantType(updated)
    }

    public async deletePlantType(plantTypeId: number): Promise<void> {
        const current = await this.repo.getPlantTypeById(plantTypeId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }

        const plantCount = await this.repo.countPlantsByTypeId(plantTypeId)
        if (plantCount > 0) {
            throw this.app.httpErrors.conflict(`Plant type ${plantTypeId} is used by plants`)
        }

        await this.repo.deletePlantType(plantTypeId)
    }

    public async listPlants(): Promise<Plant[]> {
        const rows = await this.repo.listPlants()
        return rows.map(this.toPlant)
    }

    public async getPlant(plantId: number): Promise<Plant> {
        const plant = await this.repo.getPlantById(plantId)
        if (!plant) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        return this.toPlant(plant)
    }

    public async createPlant(input: CreatePlantBody): Promise<Plant> {
        await this.ensurePlantTypeExists(input.plant_type_id)
        await this.ensurePlantNameIsAvailable(input.plant_name)

        if (input.plant_id_parent !== undefined && input.plant_id_parent !== null) {
            await this.ensurePlantExists(input.plant_id_parent)
        }

        const plant = await this.repo.createPlant({
            plant_type_id: input.plant_type_id,
            plant_name: input.plant_name,
            plant_id_parent: input.plant_id_parent ?? null,
        })

        return this.toPlant(plant)
    }

    public async updatePlant(plantId: number, input: UpdatePlantBody): Promise<Plant> {
        const current = await this.repo.getPlantById(plantId)
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

        const updated = await this.repo.updatePlant(plantId, input)
        if (!updated) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        return this.toPlant(updated)
    }

    public async deletePlant(plantId: number): Promise<void> {
        const current = await this.repo.getPlantById(plantId)
        if (!current) {
            throw this.app.httpErrors.notFound(`Plant ${plantId} not found`)
        }

        await this.repo.deletePlant(plantId)
    }

    private async ensurePlantTypeExists(plantTypeId: number): Promise<void> {
        const plantType = await this.repo.getPlantTypeById(plantTypeId)
        if (!plantType) {
            throw this.app.httpErrors.notFound(`Plant type ${plantTypeId} not found`)
        }
    }

    private async ensurePlantExists(plantId: number): Promise<void> {
        const plant = await this.repo.getPlantById(plantId)
        if (!plant) {
            throw this.app.httpErrors.notFound(`Parent plant ${plantId} not found`)
        }
    }

    private async ensurePlantTypeNameIsAvailable(plantTypeName: string): Promise<void> {
        const existing = await this.repo.getPlantTypeByName(plantTypeName)
        if (existing) {
            throw this.app.httpErrors.conflict(`Plant type "${plantTypeName}" already exists`)
        }
    }

    private async ensurePlantNameIsAvailable(plantName: string): Promise<void> {
        const existing = await this.repo.getPlantByName(plantName)
        if (existing) {
            throw this.app.httpErrors.conflict(`Plant "${plantName}" already exists`)
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

import type { Insertable, Kysely, Selectable, Updateable } from "kysely"
import type { DB, DimPlant, DimPlantType } from "#database/db.d.js"

export type PlantTypeRow = Selectable<DimPlantType>
export type PlantRow = Selectable<DimPlant>
type NewPlantTypeRow = Insertable<DimPlantType>
type NewPlantRow = Insertable<DimPlant>
type PlantTypeUpdateRow = Updateable<DimPlantType>
type PlantUpdateRow = Updateable<DimPlant>

class PlantRepository {
    constructor(private readonly db: Kysely<DB>) {}

    public async listPlantTypes(): Promise<PlantTypeRow[]> {
        return this.db.selectFrom("dim_plant_type").selectAll().orderBy("plant_type_id", "asc").execute()
    }

    public async getPlantTypeById(plantTypeId: number): Promise<PlantTypeRow | undefined> {
        return this.db
            .selectFrom("dim_plant_type")
            .selectAll()
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirst()
    }

    public async getPlantTypeByName(plantTypeName: string): Promise<PlantTypeRow | undefined> {
        return this.db
            .selectFrom("dim_plant_type")
            .selectAll()
            .where("plant_type_name", "=", plantTypeName)
            .executeTakeFirst()
    }

    public async countPlantsByTypeId(plantTypeId: number): Promise<number> {
        const result = await this.db
            .selectFrom("dim_plant")
            .select(({ fn }) => fn.count<number>("plant_id").as("count"))
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirstOrThrow()

        return result.count
    }

    public async createPlantType(input: NewPlantTypeRow): Promise<PlantTypeRow> {
        return this.db.insertInto("dim_plant_type").values(input).returningAll().executeTakeFirstOrThrow()
    }

    public async updatePlantType(plantTypeId: number, input: PlantTypeUpdateRow): Promise<PlantTypeRow | undefined> {
        return this.db
            .updateTable("dim_plant_type")
            .set(input)
            .where("plant_type_id", "=", plantTypeId)
            .returningAll()
            .executeTakeFirst()
    }

    public async deletePlantType(plantTypeId: number): Promise<boolean> {
        const result = await this.db
            .deleteFrom("dim_plant_type")
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirst()
        return Number(result.numDeletedRows) > 0
    }

    public async listPlants(): Promise<PlantRow[]> {
        return this.db.selectFrom("dim_plant").selectAll().orderBy("plant_id", "asc").execute()
    }

    public async getPlantById(plantId: number): Promise<PlantRow | undefined> {
        return this.db.selectFrom("dim_plant").selectAll().where("plant_id", "=", plantId).executeTakeFirst()
    }

    public async getPlantByName(plantName: string): Promise<PlantRow | undefined> {
        return this.db.selectFrom("dim_plant").selectAll().where("plant_name", "=", plantName).executeTakeFirst()
    }

    public async createPlant(input: NewPlantRow): Promise<PlantRow> {
        return this.db.insertInto("dim_plant").values(input).returningAll().executeTakeFirstOrThrow()
    }

    public async updatePlant(plantId: number, input: PlantUpdateRow): Promise<PlantRow | undefined> {
        return this.db
            .updateTable("dim_plant")
            .set(input)
            .where("plant_id", "=", plantId)
            .returningAll()
            .executeTakeFirst()
    }

    public async deletePlant(plantId: number): Promise<boolean> {
        const result = await this.db.deleteFrom("dim_plant").where("plant_id", "=", plantId).executeTakeFirst()
        return Number(result.numDeletedRows) > 0
    }
}

export default PlantRepository

import type { Insertable, Kysely, Selectable, Updateable } from "kysely"
import type { DB, DimPlantType } from "#database/db.d.js"

export type PlantTypeRow = Selectable<DimPlantType>
type NewPlantTypeRow = Insertable<DimPlantType>
type PlantTypeUpdateRow = Updateable<DimPlantType>

class PlantTypeRepository {
    constructor(private readonly db: Kysely<DB>) {}

    public async list(): Promise<PlantTypeRow[]> {
        return this.db.selectFrom("dim_plant_type").selectAll().orderBy("plant_type_id", "asc").execute()
    }

    public async getById(plantTypeId: number): Promise<PlantTypeRow | undefined> {
        return this.db
            .selectFrom("dim_plant_type")
            .selectAll()
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirst()
    }

    public async getByName(plantTypeName: string): Promise<PlantTypeRow | undefined> {
        return this.db
            .selectFrom("dim_plant_type")
            .selectAll()
            .where("plant_type_name", "=", plantTypeName)
            .executeTakeFirst()
    }

    public async countPlants(plantTypeId: number): Promise<number> {
        const result = await this.db
            .selectFrom("dim_plant")
            .select(({ fn }) => fn.count<number>("plant_id").as("count"))
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirstOrThrow()

        return result.count
    }

    public async create(input: NewPlantTypeRow): Promise<PlantTypeRow> {
        return this.db.insertInto("dim_plant_type").values(input).returningAll().executeTakeFirstOrThrow()
    }

    public async update(plantTypeId: number, input: PlantTypeUpdateRow): Promise<PlantTypeRow | undefined> {
        return this.db
            .updateTable("dim_plant_type")
            .set(input)
            .where("plant_type_id", "=", plantTypeId)
            .returningAll()
            .executeTakeFirst()
    }

    public async delete(plantTypeId: number): Promise<boolean> {
        const result = await this.db
            .deleteFrom("dim_plant_type")
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirst()
        return Number(result.numDeletedRows) > 0
    }
}

export default PlantTypeRepository

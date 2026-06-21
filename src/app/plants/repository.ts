import type { Insertable, Kysely, Selectable, Updateable } from "kysely"
import type { DB, DimPlant } from "#database/db.d.js"

export type PlantRow = Selectable<DimPlant>
type NewPlantRow = Insertable<DimPlant>
type PlantUpdateRow = Updateable<DimPlant>

class PlantRepository {
    constructor(private readonly db: Kysely<DB>) {}

    public async list(): Promise<PlantRow[]> {
        return this.db.selectFrom("dim_plant").selectAll().orderBy("plant_id", "asc").execute()
    }

    public async getById(plantId: number): Promise<PlantRow | undefined> {
        return this.db.selectFrom("dim_plant").selectAll().where("plant_id", "=", plantId).executeTakeFirst()
    }

    public async getByName(plantName: string): Promise<PlantRow | undefined> {
        return this.db.selectFrom("dim_plant").selectAll().where("plant_name", "=", plantName).executeTakeFirst()
    }

    public async plantTypeExists(plantTypeId: number): Promise<boolean> {
        const row = await this.db
            .selectFrom("dim_plant_type")
            .select("plant_type_id")
            .where("plant_type_id", "=", plantTypeId)
            .executeTakeFirst()

        return Boolean(row)
    }

    public async create(input: NewPlantRow): Promise<PlantRow> {
        return this.db.insertInto("dim_plant").values(input).returningAll().executeTakeFirstOrThrow()
    }

    public async update(plantId: number, input: PlantUpdateRow): Promise<PlantRow | undefined> {
        return this.db
            .updateTable("dim_plant")
            .set(input)
            .where("plant_id", "=", plantId)
            .returningAll()
            .executeTakeFirst()
    }

    public async delete(plantId: number): Promise<boolean> {
        const result = await this.db.deleteFrom("dim_plant").where("plant_id", "=", plantId).executeTakeFirst()
        return Number(result.numDeletedRows) > 0
    }
}

export default PlantRepository

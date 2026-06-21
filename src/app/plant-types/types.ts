import type { Static } from "typebox"
import type { Data } from "./schema.js"

export type PlantType = Static<typeof Data.plantType>
export type PlantTypeIdParams = Static<typeof Data.plantTypeIdParams>
export type CreatePlantTypeBody = Static<typeof Data.createPlantTypeBody>
export type UpdatePlantTypeBody = Static<typeof Data.updatePlantTypeBody>

import type { Static } from "typebox"
import type { Data } from "./schema.js"

export type PlantType = Static<typeof Data.plantType>
export type Plant = Static<typeof Data.plant>
export type PlantTypeIdParams = Static<typeof Data.plantTypeIdParams>
export type PlantIdParams = Static<typeof Data.plantIdParams>
export type CreatePlantTypeBody = Static<typeof Data.createPlantTypeBody>
export type UpdatePlantTypeBody = Static<typeof Data.updatePlantTypeBody>
export type CreatePlantBody = Static<typeof Data.createPlantBody>
export type UpdatePlantBody = Static<typeof Data.updatePlantBody>

import type { Static } from "typebox"
import type { Data } from "./schema.js"

export type Plant = Static<typeof Data.plant>
export type PlantIdParams = Static<typeof Data.plantIdParams>
export type CreatePlantBody = Static<typeof Data.createPlantBody>
export type UpdatePlantBody = Static<typeof Data.updatePlantBody>

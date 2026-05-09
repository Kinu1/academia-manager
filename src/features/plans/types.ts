export type PlanResponse = {
  id: string
  name: string
  priceAmount: number
  priceCurrency: string
  durationInDays: number
  isActive: boolean
}

export type CreatePlanRequest = {
  name: string
  priceAmount: number
  durationInDays: number
}

export type UpdatePlanRequest = CreatePlanRequest & {
  isActive: boolean
}

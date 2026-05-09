export type TrainingResponse = {
  id: string
  studentId: string
  title: string
  description: string
  scheduledForUtc: string
}

export type CreateTrainingRequest = {
  studentId: string
  title: string
  description: string
  scheduledForUtc: string
}

export type UpdateTrainingRequest = {
  title: string
  description: string
  scheduledForUtc: string
}

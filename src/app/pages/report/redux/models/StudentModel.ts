export interface responseModel {
  items: studentDataModel[]
  LastEvaluatedKey: string | undefined
}

export interface studentDataModel {
  Progress: number
  MaxProgressWeekAgo: number
  UserId: number
}

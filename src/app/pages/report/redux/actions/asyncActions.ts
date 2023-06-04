import {studentDataModel} from '../models/StudentModel'

export const STUDATA_LOADING = 'STUDATA_LOADING'
export const STUDATA_FAIL = 'STUDATA_FAIL'
export const STUDATA_SUCCESS = 'STUDATA_SUCCESS'

interface StudentAsync {
  loading: boolean
  firstCallData: studentDataModel[]
  LastEvaluatedKey: string | undefined
  error: string
}

interface FetchStudentsRequest extends StudentAsync {
  type: typeof STUDATA_LOADING
}

interface FetchStudentsSuccess extends StudentAsync {
  type: typeof STUDATA_SUCCESS
}

interface FetchStudentsFailure extends StudentAsync {
  type: typeof STUDATA_FAIL
}

export type StudentDispatchTypes =
  | FetchStudentsRequest
  | FetchStudentsSuccess
  | FetchStudentsFailure

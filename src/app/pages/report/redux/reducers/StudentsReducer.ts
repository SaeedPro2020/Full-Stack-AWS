import {
  STUDATA_SUCCESS,
  STUDATA_LOADING,
  STUDATA_FAIL,
  StudentDispatchTypes,
} from '../actions/asyncActions'

import {studentDataModel} from '../models/StudentModel'

export interface StudentsDataState {
  loading: boolean
  firstCallData: studentDataModel[]
  LastEvaluatedKey: string | undefined
}

const defaultState: StudentsDataState = {
  loading: false,
  firstCallData: [],
  LastEvaluatedKey: '',
}

export const studentsReducer = (
  state = defaultState,
  action: StudentDispatchTypes
): StudentsDataState => {
  switch (action.type) {
    case STUDATA_LOADING:
      return {...state, loading: true}
    case STUDATA_SUCCESS:
      return {
        ...state,
        loading: false,
        firstCallData: action.firstCallData,
        LastEvaluatedKey: action.LastEvaluatedKey,
      }
    case STUDATA_FAIL:
      return {...state, loading: false, firstCallData: []}
    default:
      return state
  }
}

import {Dispatch} from 'redux'
import {STUDATA_FAIL, STUDATA_LOADING, STUDATA_SUCCESS, StudentDispatchTypes} from './asyncActions'
import {responseModel} from '../models/StudentModel'
import {AppActions} from './actions'
import {filterData} from '../../../../../api/apicalls'

export const requestStudendData = (): AppActions => ({
  type: STUDATA_LOADING,
  loading: true,
  firstCallData: [],
  LastEvaluatedKey: '',
  error: '',
})

export const receiveCall1dStudents = (data: responseModel): AppActions => ({
  type: STUDATA_SUCCESS,
  loading: false,
  firstCallData: data.items,
  LastEvaluatedKey: data.LastEvaluatedKey,
  error: '',
})

export const invalidateStudents = (): AppActions => ({
  type: STUDATA_FAIL,
  loading: false,
  firstCallData: [],
  LastEvaluatedKey: '',
  error: 'Unable to fetch data',
})

export const GetStudents =
  (dateParm: string, subjectParm: string, LastEvaluatedKey: string | undefined) =>
  async (dispatch: Dispatch<StudentDispatchTypes>) => {
    try {
      dispatch(requestStudendData())

      const res = (await filterData(
        dateParm,
        subjectParm,
        LastEvaluatedKey
      )) as unknown as responseModel
      console.log('GET DATA FROM API', res.items)
      dispatch(receiveCall1dStudents(res))
    } catch (e) {
      dispatch(invalidateStudents())
    }
  }

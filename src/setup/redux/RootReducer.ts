import {all} from 'redux-saga/effects'
import {combineReducers} from 'redux'
import * as auth from '../../app/modules/auth'
import {studentsReducer} from '../../app/pages/report/redux/reducers/StudentsReducer'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  studentsReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function* rootSaga() {
  yield all([auth.saga()])
}

import {Action} from '@reduxjs/toolkit'
import {persistReducer} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import {put, takeLatest, select} from 'redux-saga/effects'
import {UserModel} from '../models/UserModel'
import {authCurrentUser} from './AuthCRUD'

export interface ActionWithPayload<T> extends Action {
  payload?: T
}

export const actionTypes = {
  Login: '[Login] Action',
  Logout: '[Logout] Action',
  Register: '[Register] Action',
  UserRequested: '[Request User] Action',
  UserLoaded: '[Load User] Auth API',
  SetUser: '[Set User] Action',
}

const initialAuthState: IAuthState = {
  user: undefined,
  userNameCognito: undefined,
}

export interface IAuthState {
  user?: UserModel
  userNameCognito?: string
}

export const reducer = persistReducer(
  {storage, key: 'v100-demo1-auth', whitelist: ['user', 'userNameCognito']},
  (state: IAuthState = initialAuthState, action: ActionWithPayload<IAuthState>) => {
    switch (action.type) {
      case actionTypes.Login: {
        const userNameCognito = action.payload?.userNameCognito
        return {userNameCognito, user: undefined}
      }

      case actionTypes.Register: {
        const userNameCognito = action.payload?.userNameCognito
        return {userNameCognito, user: undefined}
      }

      case actionTypes.Logout: {
        return initialAuthState
      }

      case actionTypes.UserLoaded: {
        const user = action.payload?.user
        return {...state, user}
      }

      case actionTypes.SetUser: {
        const user = action.payload?.user
        return {...state, user}
      }

      default:
        return state
    }
  }
)

export const actions = {
  login: (userNameCognito: string) => ({type: actionTypes.Login, payload: {userNameCognito}}),
  register: (userNameCognito: string | undefined) => ({
    type: actionTypes.Register,
    payload: {userNameCognito},
  }),
  logout: () => ({type: actionTypes.Logout}),
  requestUser: () => ({
    type: actionTypes.UserRequested,
  }),
  fulfillUser: (user: Boolean) => ({type: actionTypes.UserLoaded, payload: {user}}),
  setUser: (user: UserModel) => ({type: actionTypes.SetUser, payload: {user}}),
  store: () => ({type: 'def'}),
}

export function* saga() {
  yield takeLatest(actionTypes.Login, function* loginSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.Register, function* registerSaga() {
    yield put(actions.requestUser())
  })

  yield takeLatest(actionTypes.UserRequested, function* userRequested() {
    // @ts-ignore
    const getToken = (state) => state.auth.userNameCognito
    // @ts-ignore
    // eslint-disable-next-line
    let token = yield select(getToken)
    const {data: user} = yield authCurrentUser()
    yield put(actions.fulfillUser(user))
  })
}

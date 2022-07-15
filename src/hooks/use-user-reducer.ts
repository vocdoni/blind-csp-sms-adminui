import { Reducer, useReducer } from 'react'
import { UserData } from '@localtypes'

const emptyUser : UserData = {
  userID: '',
  elections: {},
  extraData: '',
  phone: {
    country_code: 0,
    national_number: 0,
  },
}

export const ResetUser = 'user:reset'
export const SetUser = 'user:set'
export const SetRemainingAttempts = 'user:remaining_attempts:set'
export const PhoneUpdate = 'user:phone:update'
export const SetConsumed = 'user:consumed:set'

type RemainingAttemptsPayload = {
  process: string
  attempts: number
}
type PhonePayload = {
  prefix: number
  national: number
}
type ConsumedPayload = {
  process: string,
  consumed: boolean
}
type SetUserPayload = UserData

type UserType = typeof SetRemainingAttempts
  | typeof PhoneUpdate
  | typeof SetConsumed
  | typeof SetUser
  | typeof ResetUser

type UserPayload = RemainingAttemptsPayload | PhonePayload | ConsumedPayload | SetUserPayload

export type UserAction = {
  type: UserType
  payload?: UserPayload
}

const userReducer : Reducer<UserData, UserAction> = (state: UserData, action: UserAction) => {
  let payload
  switch (action.type) {
    case ResetUser:
      return {
        ...emptyUser,
      }
    case SetUser:
      payload = (action.payload as SetUserPayload)
      return {
        ...payload,
      }
    case SetRemainingAttempts:
      payload = (action.payload as RemainingAttemptsPayload)
      return {
        ...state,
        elections: {
          ...state.elections,
          [payload.process]: {
            ...state.elections[payload.process],
            remainingAttempts: payload.attempts,
          },
        },
      }
    case SetConsumed:
      payload = (action.payload as ConsumedPayload)
      return {
        ...state,
        elections: {
          ...state.elections,
          [payload.process]: {
            ...state.elections[payload.process],
            consumed: payload.consumed,
          },
        },
      }
    case PhoneUpdate:
      payload = (action.payload as PhonePayload)
      return {
        ...state,
        phone: {
          country_code: payload.prefix,
          national_number: payload.national,
        },
      }
  }

  return state
}

export const useUserReducer = () => useReducer(userReducer, emptyUser)

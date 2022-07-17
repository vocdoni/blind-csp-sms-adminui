import { createRef, Dispatch, Reducer, RefObject, useReducer } from 'react'
import { Election, UserData } from '@localtypes'
import { ATTEMPTS_MAX_DEFAULT } from '@constants'

const emptyUser : UserData = {
  userID: '',
  elections: {},
  extraData: '',
  phone: {
    country_code: 0,
    national_number: 0,
  },
}

type Indexed = {
  [hash: string]: UserData,
}

export interface UserState {
  error: null | Error
  loaded: boolean
  loading: boolean
  hashRef: RefObject<HTMLInputElement>
  indexed: Indexed
  searchResults: string[]
  user: UserData
  addAttempt: (process: string) => Promise<boolean>
  addElection: (process: string) => Promise<boolean>
  clone: (user: string) => Promise<boolean>
  get: (user: string) => Promise<void>
  updatePhone: (phone: string) => Promise<boolean>
  remove: () => Promise<boolean>
  reset: () => void
  resetAttempts: (process: string) => Promise<boolean>
  search: (term: string) => Promise<void>
  set: (user: string) => void
  setConsumed: (process: string, consumed: boolean) => Promise<boolean>
  dispatch: Dispatch<UserAction>
}

export const UserStateEmpty : UserState = {
  error: null,
  loaded: false,
  loading: false,
  hashRef: createRef(),
  indexed: {},
  searchResults: [],
  user: {
    ...emptyUser,
  },
  addAttempt: (process) => Promise.reject(false),
  addElection: (process) => Promise.reject(false),
  clone: (user) => Promise.reject(false),
  get: (user) => Promise.reject(),
  updatePhone: (phone) => Promise.reject(false),
  remove: () => Promise.reject(false),
  reset: () => {},
  resetAttempts: (process) => Promise.reject(false),
  search: (term) => Promise.reject(),
  set: (user) => {},
  setConsumed: (process, consumed) => Promise.reject(false),
  dispatch: (action) => {},
}

export const AddElection = 'user:election:add'
export const Loaded = 'user:loaded'
export const Loading = 'user:loading'
export const Remove = 'user:remove'
export const Reset = 'user:reset'
export const SearchSetResults = 'user:search:results'
export const Set = 'user:set'
export const SetIndexed = 'user:indexed:set'
export const SetConsumed = 'user:consumed:set'
export const SetError = 'user:error:set'
export const SetRemainingAttempts = 'user:remaining_attempts:set'
export const UpdatePhone = 'user:phone:update'

type AddElectionPayload = string
type RemovePayload = string
type SetRemainingAttemptsPayload = {
  process: string
  attempts: number
}
type SearchSetResultsPayload = string[]
type SetConsumedPayload = {
  process: string,
  consumed: boolean
}
type SetPayload = UserData
type SetErrorPayload = Error
type UpdatePhonePayload = {
  prefix: number
  national: number
}

type UserType = typeof AddElection
  | typeof Loaded
  | typeof Loading
  | typeof Remove
  | typeof Reset
  | typeof SearchSetResults
  | typeof Set
  | typeof SetIndexed
  | typeof SetConsumed
  | typeof SetError
  | typeof SetRemainingAttempts
  | typeof UpdatePhone

type UserPayload = AddElectionPayload
  | SearchSetResultsPayload
  | SetConsumedPayload
  | SetErrorPayload
  | SetPayload
  | SetRemainingAttemptsPayload
  | UpdatePhonePayload

export type UserAction = {
  type: UserType
  payload?: UserPayload
}

const setIndexedValue = (indexed: Indexed, process: string, field: string, value: any) => {
  for (const key in indexed) {
    const user = indexed[key]
    if (!(user.elections && user.elections[process])) {
      continue
    }
    indexed[key].elections[process] = {
      ...indexed[key].elections[process],
      [field]: value,
    }
  }

  return indexed
}

const userReducer : Reducer<UserState, UserAction> = (state: UserState, action: UserAction) => {
  let payload : UserPayload
  switch (action.type) {
    case AddElection:
      payload = (action.payload as AddElectionPayload)
      return {
        ...state,
        loading: false,
        user: {
          ...state.user,
          elections: {
            ...state.user.elections,
            [payload]: {
              consumed: false,
              electionId: payload,
              remainingAttempts: ATTEMPTS_MAX_DEFAULT,
            } as Election,
          },
        }
      }
    case Loaded:
      return {
        ...state,
        loaded: true,
        loading: false,
      }
    case Loading:
      return {
        ...state,
        loaded: false,
        loading: true,
      }
    case Remove: {
      payload = (action.payload as RemovePayload)
      const indexed = {...state.indexed}
      if (indexed[payload]) {
        delete indexed[payload]
      }

      return {
        ...state,
        indexed,
      }
    }
    case Reset:
      return {
        ...state,
        loaded: false,
        loading: false,
        error: null,
        user: {
          ...emptyUser,
        },
      }

    case SearchSetResults:
      payload = (action.payload as SearchSetResultsPayload)
      return {
        ...state,
        loading: false,
        searchResults: payload,
      }
    case Set:
      payload = (action.payload as SetPayload)
      return {
        ...state,
        loaded: true,
        loading: false,
        user: {
          ...payload,
        },
        indexed: {
          ...state.indexed,
          [payload.userID]: payload,
        },
      }
    case SetIndexed:
      payload = (action.payload as SetPayload)
      return {
        ...state,
        loaded: true,
        loading: false,
        indexed: {
          ...state.indexed,
          [payload.userID]: payload,
        },
      }
    case SetError:
      payload = (action.payload as SetErrorPayload)
      return {
        ...state,
        loading: false,
        loaded: false,
        error: payload,
        user: {
          ...emptyUser,
        },
      }
    case SetRemainingAttempts:
      payload = (action.payload as SetRemainingAttemptsPayload)
      return {
        ...state,
        loading: false,
        indexed: setIndexedValue({...state.indexed}, payload.process, 'remainingAttempts', payload.attempts),
        user: {
          ...state.user,
          elections: {
            ...state.user.elections,
            [payload.process]: {
              ...state.user.elections[payload.process],
              remainingAttempts: payload.attempts,
            },
          },
        },
      }
    case SetConsumed:
      payload = (action.payload as SetConsumedPayload)
      return {
        ...state,
        loading: false,
        indexed: setIndexedValue({...state.indexed}, payload.process, 'consumed', payload.consumed),
        user: {
          ...state.user,
          elections: {
            ...state.user.elections,
            [payload.process]: {
              ...state.user.elections[payload.process],
              consumed: payload.consumed,
            },
          },
        }
      }
    case UpdatePhone:
      payload = (action.payload as UpdatePhonePayload)
      return {
        ...state,
        indexed: {
          ...state.indexed,
          [state.user.userID]: {
            ...state.indexed[state.user.userID],
            phone: {
              country_code: payload.prefix,
              national_number: payload.national,
            },
          }
        },
        loading: false,
        user: {
          ...state.user,
          phone: {
            country_code: payload.prefix,
            national_number: payload.national,
          },
        }
      }
  }

  return state
}

export const useUserReducer = () => useReducer(userReducer, UserStateEmpty)

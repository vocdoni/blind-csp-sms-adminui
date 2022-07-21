import { ATTEMPTS_MAX_DEFAULT } from '@constants'
import { Election, Phone, UserData } from '@localtypes'
import { createRef, Dispatch, Reducer, RefObject, useReducer } from 'react'

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
  getAll: () => Promise<string[] | boolean>
  remove: () => Promise<boolean>
  removeElection: (election: string) => Promise<boolean>
  reset: () => void
  resetAll: () => void
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
  getAll: () => Promise.reject(false),
  remove: () => Promise.reject(false),
  removeElection: (election) => Promise.reject(false),
  reset: () => {},
  resetAll: () => {},
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
export const RemoveElection = 'user:election:remove'
export const Reset = 'user:reset'
export const SearchSetResults = 'user:search:results'
export const Set = 'user:set'
export const SetIndexed = 'user:indexed:set'
export const SetConsumed = 'user:consumed:set'
export const SetError = 'user:error:set'
export const SetRemainingAttempts = 'user:remaining_attempts:set'
export const Update = 'user:update'

type AddElectionPayload = string
type RemoveElectionPayload = string
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
type UpdatePayload = {
  phone: Phone
  extra?: string
}

type UserType = typeof AddElection
  | typeof Loaded
  | typeof Loading
  | typeof Remove
  | typeof RemoveElection
  | typeof Reset
  | typeof SearchSetResults
  | typeof Set
  | typeof SetIndexed
  | typeof SetConsumed
  | typeof SetError
  | typeof SetRemainingAttempts
  | typeof Update

type UserPayload = AddElectionPayload
  | RemoveElectionPayload
  | RemovePayload
  | SearchSetResultsPayload
  | SetConsumedPayload
  | SetErrorPayload
  | SetPayload
  | SetRemainingAttemptsPayload
  | UpdatePayload

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
  let payload : any
  switch (action.type) {
    case AddElection:
      payload = (action.payload as AddElectionPayload)
      const newElection : Election = {
        consumed: false,
        electionId: payload,
        remainingAttempts: ATTEMPTS_MAX_DEFAULT,
      }
      return {
        ...state,
        loading: false,
        indexed: {
          ...state.indexed,
          [payload]: {
            ...state.indexed[payload],
            elections: {
              ...state.indexed[payload].elections,
              [payload]: newElection,
            }
          },
        },
        user: {
          ...state.user,
          elections: {
            ...state.user.elections,
            [payload]: newElection,
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
    case RemoveElection: {
      payload = (action.payload as RemoveElectionPayload)
      const indexed = {...state.indexed}
      const user = {...state.user}
      delete indexed[state.user.userID].elections[payload]
      delete user.elections[payload]
      return {
        ...state,
        indexed,
        user,
      }
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

    case SearchSetResults: {
      payload = (action.payload as SearchSetResultsPayload)
      // cleanup indexed data in order to ensure data update on new searches
      const indexed  = {...state.indexed}
      for (const hash of payload) {
        delete indexed[hash]
      }
      return {
        ...state,
        indexed,
        loading: false,
        searchResults: payload,
      }
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
    case Update: {
      payload = (action.payload as UpdatePayload)
      const user : UserData = {
        ...state.user,
        phone: payload.phone,
      }
      if (payload.extra) {
        user.extraData = payload.extra
      }

      return {
        ...state,
        indexed: {
          ...state.indexed,
          [state.user.userID]: user,
        },
        loading: false,
        user,
      }
    }
  }

  return state
}

export const useUserReducer = () => useReducer(userReducer, UserStateEmpty)

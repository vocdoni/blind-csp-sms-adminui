import { API_BASE } from '@constants'
import axios, { AxiosInstance } from 'axios'
import { createContext, Reducer, RefObject, useReducer } from 'react'

export const ApiBaseSet = 'api:base:set'
export const ApiBaseReset = 'api:base:reset'
export const ApiTokenSet = 'api:token:set'
export const ApiTokenReset = 'api:token:reset'

export type ApiBaseSetPayload = string
export type ApiTokenSetPayload = string

export type ApiActionPayload = ApiBaseSetPayload | ApiTokenSetPayload
export type ApiActionType = typeof ApiBaseSet
  | typeof ApiBaseReset
  | typeof ApiTokenSet
  | typeof ApiTokenReset

export interface ApiAction {
  type: ApiActionType
  payload?: ApiActionPayload
}

export interface ApiState {
  base: {
    valid: boolean
    url: string
  }
  token: {
    valid: boolean
    id: string
  }
  client: AxiosInstance
  dump: () => Promise<void>
  restore: (json: object) => Promise<boolean>
  saveBase: (baseRef: RefObject<HTMLInputElement>) => void
  saveToken: (tokenRef: RefObject<HTMLInputElement>) => void
}

export const ApiStateEmpty : ApiState = {
  base: {
    valid: false,
    url: API_BASE,
  },
  token: {
    valid: false,
    id: '',
  },
  client: axios.create(),
  dump: () => Promise.resolve(),
  restore: (json) => Promise.resolve(false),
  saveBase: (baseRef) => {},
  saveToken: (baseRef) => {},
}

export const ApiContext = createContext<ApiState>(ApiStateEmpty)

const apiReducer : Reducer<ApiState, ApiAction> = (state: ApiState, action: ApiAction) => {
  let payload
  switch (action.type) {
    case ApiBaseReset:
      return {
        ...state,
        base: {
          ...ApiStateEmpty.base,
        },
        token: {
          ...ApiStateEmpty.token,
        },
        client: axios.create(),
      }

    case ApiBaseSet:
      payload = (action.payload as ApiBaseSetPayload)
      return {
        ...state,
        base: {
          valid: true,
          url: payload,
        },
      }

    case ApiTokenReset:
      return {
        ...state,
        token: {
          ...ApiStateEmpty.token,
        },
      }

    case ApiTokenSet:
      payload = (action.payload as ApiTokenSetPayload)
      return {
        ...state,
        token: {
          valid: true,
          id: payload,
        },
        client: axios.create({
          baseURL: state.base.url,
          headers: {
            Authorization: `Bearer ${payload}`,
          },
        })
      }

  }

  return state
}

export const useApiReducer = () => useReducer(apiReducer, ApiStateEmpty)

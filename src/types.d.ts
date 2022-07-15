import { AxiosInstance } from 'axios'
import { Dispatch, RefObject } from 'react'
import { UserAction } from './hooks/use-user-reducer'

type ShowError = (text: string, description?: string) => void
type ShowSuccess = (text: string, description?: string) => void
type CloneUserProps = {
  showError: ShowError
  showSuccess: ShowSuccess
  client: AxiosInstance
  user: UserData
  setUser: SetUser
  userDispatch: UserDispatch
}
type CreateUserProps = {
  showError: ShowError
  showSuccess: ShowSuccess
  client: AxiosInstance
}
type Election = {
  electionId: string
  remainingAttempts: number
  consumed: boolean
  challenge: number
}

type UserData = {
  userID: string
  elections: {
    [id: string]: Election
  }
  extraData: string
  phone: {
    country_code: number
    national_number: number
  }
}

type SetUser = (user: string) => void
type UserDispatch = Dispatch<UserAction>

type UserQueryProps = {
  client: AxiosInstance
  showError: ShowError
  setUser: SetUser
  userDispatch: UserDispatch
  clearRef: RefObject<HTMLButtonElement>
}

type QueriesProps = UserQueryProps

type UserSearchResultRowProps = Omit<UserQueryProps, 'clearRef'> & {
  hash: string
}

type PhoneNumberProps = {
  client: AxiosInstance
  user: UserData
  userDispatch: UserDispatch
  showError: ShowError
  showSuccess: ShowSuccess
}

type UserActionsProps = PhoneNumberProps

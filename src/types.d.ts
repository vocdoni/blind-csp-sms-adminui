import { AxiosInstance } from 'axios'
import { Dispatch, RefObject } from 'react'
import { UserAction } from './hooks/use-user-reducer'

type ShowError = (text: string, description?: string) => void
type ShowSuccess = (text: string, description?: string) => void

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

type Phone = {
  country_code: number
  national_number: number
}

type UserData = {
  userID: string
  elections: {
    [id: string]: Election
  }
  extraData: string
  phone: Phone
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

type UserSearchResultRowProps = {
  hash: string
}

type UserAuthProps = {
  election: Election
}

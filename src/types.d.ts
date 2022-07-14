import { AxiosInstance } from 'axios'
import { RefObject } from 'react'

type ShowError = (text: string, description?: string) => void
type ShowSuccess = (text: string, description?: string) => void
type FakePinProps = {
  showError: ShowError
  showSuccess: ShowSuccess
  client: AxiosInstance
  user: UserData
  setUser: SetUser
  setUserData: SetUserData
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
type SetUserData = (data: UserData) => void

type UserQueryProps = {
  client: AxiosInstance
  showError: ShowError
  setUser: SetUser
  setUserData: SetUserData
  clearRef: RefObject<HTMLButtonElement>
}

type QueriesProps = UserQueryProps

type UserSearchResultRowProps = Omit<UserQueryProps, 'clearRef'> & {
  hash: string
}

type PhoneNumberProps = {
  client: AxiosInstance
  showError: ShowError
  showSuccess: ShowSuccess
  user: UserData
  setUserData: SetUserData
}

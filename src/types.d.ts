import { AxiosInstance } from 'axios'

type ShowError = (text: string, description?: string) => void
type ShowSuccess = (text: string, description?: string) => void
type FakePinProps = {
  showError: ShowError
  client: AxiosInstance
  user: UserData
}
type CreateUserProps = {
  showError: ShowError
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
}

type QueriesProps = UserQueryProps

type UserSearchResultRowProps = UserQueryProps & {
  hash: string
}

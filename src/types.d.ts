import { Dispatch, RefObject } from 'react'
import { UserAction } from './hooks/use-user-reducer'

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

type QueriesProps = UserQueryProps

type UserSearchResultRowProps = {
  hash: string
  dataRef: RefObject<HTMLDivElement>
}

type UserAuthProps = {
  election: Election
}

type UpdatableData = {
  extra?: string
  phone: string
}

type UserFormStateData = UpdatableData & {
  hash: string
}

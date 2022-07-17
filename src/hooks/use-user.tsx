import { useToast } from '@chakra-ui/react'
import { ATTEMPTS_MAX_DEFAULT } from '@constants'
import { UserData } from '@localtypes'
import { formatError } from '@utils'
import { createContext, ReactNode, useContext, useRef } from 'react'
import { useApi } from './use-api'
import {
  AddElection,
  Loaded,
  Loading,
  Reset,
  SearchSetResults,
  Set,
  SetConsumed,
  SetError,
  SetIndexed,
  SetRemainingAttempts,
  UpdatePhone,
  UserState,
  UserStateEmpty,
  useUserReducer,
} from './use-user-reducer'

export const UserContext = createContext<UserState>(UserStateEmpty)

export const UserProvider = ({children}: {children: ReactNode}) => {
  const [ state, dispatch ] = useUserReducer()
  const { client } = useApi()
  const toast = useToast()
  const timeoutRef = useRef<NodeJS.Timeout>()

  const { user } = state

  const get = async (user: string) => {
    try {
      const { data } = await client.get(`/user/${user}`)
      dispatch({
        type: SetIndexed,
        payload: data,
      })

      return data
    } catch (e) {
      console.error(`error getting user ${user}`, e)
    }
  }

  const search = async (term: string) => {
    dispatch({type: Loading})

    if (!term.trim().length) {
      dispatch({
        type: SearchSetResults,
        payload: [],
      })

      return
    }

    try {
      const { data } = await client.post('/search', {term})

      dispatch({
        type: SearchSetResults,
        payload: data.users,
      })
    } catch (e) {
      toast({
        status: 'error',
        title: 'Error searching user',
        description: 'Check console for details',
      })
      console.error(e)
    }
  }

  const set = (user: string) => {
    if (!user.length) {
      dispatch({type: Reset})
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      dispatch({type: Loading})

      client.get(`/user/${user}`)
        .then(({data}: {data: UserData}) => {
          dispatch({
            type: Set,
            payload: data,
          })
        }).catch((e) => {
          dispatch({
            type: SetError,
            payload: formatError(e),
          })
        })
    }, 500)
  }

  const addAttempt = async (process: string) : Promise<boolean> => {
    dispatch({type: Loading})

    try {
      const response = await client.get(`/addAttempt/${user.userID}/${process}`)
      if (response.data.ok !== 'true') {
        throw new Error('got API failure during addattempt')
      }
      dispatch({
        type: SetRemainingAttempts,
        payload: {
          process,
          attempts: user.elections[process].remainingAttempts + 1,
        },
      })
      toast({
        status: 'success',
        title: 'Attempt added',
      })
      return true
    } catch (e) {
      toast({
        status: 'error',
        title: 'Couldn\'t add attempt',
        description: 'Check console for details',
      })
      console.error('Could not add attempt:', e)
    }
    return false
  }

  const addElection = async (process: string) : Promise<boolean> => {
    dispatch({type: Loading})

    try {
      const response = await client.get(`/addElection/${user.userID}/${process}`)
      if (response.data.ok !== 'true') {
        throw new Error('got API failure during addattempt')
      }
      dispatch({
        type: AddElection,
        payload: process,
      })
      toast({
        status: 'success',
        title: 'Election added successfully',
      })
      return true
    } catch (e) {
      dispatch({type: Loaded})
      toast({
        status: 'error',
        title: 'Couldn\'t add election',
        description: 'Check console for details',
      })
      console.error('Could not add election:', e)
    }
    return false
  }

  const clone = async (hash: string) : Promise<boolean> => {
    dispatch({type: Loading})

    try {
      // clone user
      const response = await client.get(`/cloneUser/${user.userID}/${hash}`)
      if (!response.data.ok) {
        throw new Error('got API failure during cloneUser')
      }
      // mark old as consumed (only if there are elections, ofc..)
      if (user.elections && Object.keys(user.elections).length > 0) {
        for (const process in user.elections) {
          const consumed = await client.get(`/setConsumed/${user.userID}/${process}/true`)
          if (consumed.data.ok !== 'true') {
            console.warn('Could not set old user consumed status (setConsumed)', consumed)
            continue
          }
          dispatch({
            type: SetConsumed,
            payload: {
              consumed: true,
              process,
            },
          })
        }
      }
      // retrieve the new user data (and store it to state)
      const { data } = await client.get(`/user/${hash}`)
      if (!(data as UserData).userID) {
        throw new Error('Could not fetch new user data')
      }

      dispatch({
        type: Set,
        payload: (data as UserData),
      })
      toast({
        status: 'success',
        title: 'User cloned successfully',
        description: 'New user data already loaded',
      })

      return true
    } catch (e) {
      dispatch({type: Loaded})
      toast({
        status: 'error',
        title: 'Couldn\'t clone user',
        description: 'Try changing credentials & check console for more details',
      })
      console.error('Could not clone user:', e)
    }
    return false
  }

  const remove = async () => {
    dispatch({type: Loading})

    try {
      const response = await client.get(`/delUser/${user.userID}`)
      if (response.data.ok !== 'true') {
        throw new Error('API returned KO')
      }
      toast({
        status: 'success',
        title: 'User removed successfully',
      })
      reset()
      return true
    } catch (e) {
      dispatch({type: Loaded})
      toast({
        status: 'error',
        title: 'Could not remove user',
        description: 'Check console for details',
      })
      console.error('Could not remove user:', e)
    }

    return false
  }

  const updatePhone = async (phone: string) => {
    dispatch({type: Loading})

    try {
      const response = await client.get(`/setPhone/${user.userID}/${phone}`)
      if (response.data.ok !== 'true') {
        throw new Error('API returned KO')
      }
      dispatch({
        type: UpdatePhone,
        payload: {
          // note this dirty trick is only to show the data in the UI
          prefix: parseInt(phone.substring(1, 3), 10),
          national: parseInt(phone.substring(3), 10),
        }
      })
      toast({
        status: 'success',
        title: 'Phone has been updated',
      })

      return true
    } catch (e) {
      dispatch({type: Loaded})
      toast({
        status: 'error',
        title: 'Could not update phone',
        description: 'Check the console for details',
      })
      console.error(e)
    }

    return false
  }

  const reset = () => {
    dispatch({type: Reset})
    if (!state.hashRef.current) return
    state.hashRef.current.value = ''
  }

  const resetAttempts = async (process: string) => {
    const election = user.elections[process]
    if (!election) {
      toast({
        status: 'warning',
        title: 'User has no access to that election',
      })
      return false
    }

    const attempts = ATTEMPTS_MAX_DEFAULT - election.remainingAttempts
    let successful = 0

    if (!attempts) {
      toast({
        status: 'success',
        title: `User already has ${ATTEMPTS_MAX_DEFAULT} attempts`,
      })
      return true
    }

    for (let i = 0; i < attempts; i++) {
      await client.get(`/addAttempt/${user.userID}/${election.electionId}`)
        // eslint-disable-next-line no-loop-func
        .then(() => {
          successful++
        })
        .catch((e: any) => {
          console.error(`error adding attempt to user ${user.userID}:`, e)
          toast({
            status: 'error',
            title: 'Error adding attempt',
            description: 'Check console for more details',
          })
        })
    }
    dispatch({
      type: SetRemainingAttempts,
      payload: {
        process: election.electionId,
        attempts: successful + election.remainingAttempts,
      },
    })
    if (successful === attempts) {
      toast({
        status: 'success',
        title: 'SMS attempts reset successfully',
      })

      return true
    }

    return false
  }

  const setConsumed = async (process: string, consumed: boolean) => {
    const election = user.elections[process]
    if (!election) {
      toast({
        status: 'warning',
        title: 'User has no access to that election',
      })
      return false
    }

    try {
      await client.get(`/setConsumed/${user.userID}/${election.electionId}/${consumed.toString()}`)
      dispatch({
        type: SetConsumed,
        payload: {
          process: election.electionId,
          consumed: consumed,
        },
      })
      toast({
        status: 'success',
        title: `Consumed status set to ${!consumed ? 'NOT' : ''} consumed successfully`,
      })
      return true
    } catch (e: any) {
      toast({
        status: 'error',
        title: 'Sorry, couldn\'t do that',
        description: 'Check console for more details',
      })
      console.error(`error setting consumed to user ${user.userID}:`, e)
    }

    return false
  }

  const value = {
    ...state,
    addAttempt,
    addElection,
    clone,
    get,
    reset,
    remove,
    resetAttempts,
    search,
    set,
    setConsumed,
    updatePhone,
    dispatch,
  }
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const user = useContext(UserContext)

  if (!user) {
    throw new Error('useUser() must be used inside an <UserProvider /> declaration')
  }

  return user
}

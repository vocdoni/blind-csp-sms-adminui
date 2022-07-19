import { useToast } from '@chakra-ui/react'
import { formatError, processApiResponse } from '@utils'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useApi } from './use-api'

export interface UserCreateState {
  loading: boolean
  error: string | null
  data: StateData
  clear: () => void
  create: () => Promise<boolean>
  setData: (data: StateData) => void
}

type StateData = UpdatableData & {
  hash: string
}

type UpdatableData = {
  extra?: string
  phone: string
}

const UserCreateStateEmpty : UserCreateState = {
  loading: false,
  error: null,
  data: {hash: '', phone: ''},
  clear: () => {},
  create: () => Promise.reject(false),
  setData: (data) => {},
}

export const UserCreateContext = createContext<UserCreateState>(UserCreateStateEmpty)

export const UserCreateProvider = ({children}: {children: ReactNode}) => {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string | null>(null)
  const [ data, setData ] = useState<StateData>({hash: '', phone: ''})
  const toast = useToast()
  const { client } = useApi()

  const clear = () => {
    setLoading(false)
    setError(null)
    setData({hash: '', phone: ''})
  }

  const create = async () => {
    if (!data.hash.length) {
      return false
    }

    setLoading(true)
    try {
      if (!data.phone.length) {
        throw new Error('Phone not specified')
      }

      await client.post(`/smsapi/newUser/${data.hash}`, data).then(processApiResponse)

      setLoading(false)

      return true
    } catch (e) {
      const description = formatError(e).message
      toast({
        status: 'error',
        title: 'There was an error creating the user',
        description,
      })
      setError(description)
      console.warn('There was an error creating the user:', e)

      setLoading(false)
    }
    return false
  }

  const value = {
    create,
    loading,
    clear,
    error,
    data,
    setData,
  }

  return (
    <UserCreateContext.Provider value={value}>
      {children}
    </UserCreateContext.Provider>
  )
}

export const useUserCreate = () => {
  const cntx = useContext(UserCreateContext)
  if (!cntx) {
    throw new Error('useUserCreate() must be used inside <UserCreateProvider/ >')
  }
  return cntx
}

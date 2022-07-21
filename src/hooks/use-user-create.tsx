import { useDisclosure, useToast } from '@chakra-ui/react'
import { UserFormStateData } from '@localtypes'
import { formatError, processApiResponse } from '@utils'
import { createContext, ReactNode, useContext, useState } from 'react'
import { useApi } from './use-api'
import { useUser } from './use-user'

export interface UserCreateState {
  error: string | null
  data: UserFormStateData
  edit: {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void
  }
  loading: boolean
  clear: () => void
  create: () => Promise<boolean>
  update: () => Promise<boolean>
  setData: (data: UserFormStateData) => void
}

const UserDataEmptyState = {
  hash: '',
  phone: '',
}

const UserCreateStateEmpty : UserCreateState = {
  error: null,
  data: UserDataEmptyState,
  edit: {
    isOpen: false,
    onOpen: () => {},
    onClose: () => {},
  },
  loading: false,
  clear: () => {},
  create: () => Promise.reject(false),
  update: () => Promise.reject(false),
  setData: (data) => {},
}

export const UserCreateContext = createContext<UserCreateState>(UserCreateStateEmpty)

export const UserCreateProvider = ({children}: {children: ReactNode}) => {
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ error, setError ] = useState<string | null>(null)
  const [ data, setData ] = useState<UserFormStateData>(UserDataEmptyState)
  const edit = useDisclosure()
  const toast = useToast()
  const { client } = useApi()
  const { set } = useUser()

  const clear = () => {
    setLoading(false)
    setError(null)
    setData(UserDataEmptyState)
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
      set(data.hash)
      clear()

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

  const update = async () => {
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
      set(data.hash)
      clear()

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
    data,
    edit,
    error,
    loading,
    clear,
    create,
    setData,
    update,
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

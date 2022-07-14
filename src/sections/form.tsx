import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  useColorModeValue,
  useToast,
  ToastId,
  FormErrorMessage,
  Heading,
  Divider,
  Button,
} from '@chakra-ui/react'
import axios, { AxiosInstance } from 'axios'
import React, { useRef, useState } from 'react'
import { If, Then } from 'react-if'
import FakePin from '../components/FakePin'
import { API_BASE } from '../constants'
import Queries from '../components/Queries'
import { UserData } from '../types'
import UserDataDisplay from '../components/UserDataDisplay'
import UserActions from '../components/UserActions'
import { DeleteIcon } from '@chakra-ui/icons'

const emptyUser : UserData = {
  userID: '',
  elections: {},
  extraData: '',
  phone: {
    country_code: 0,
    national_number: 0,
  }
}

export default function Form() {
  const tokenRef = useRef<HTMLInputElement>(null)
  const clearRef = useRef<HTMLButtonElement>(null)
  const toastRef = useRef<ToastId>()
  const toast = useToast()
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const client = useRef<AxiosInstance>()
  const [userError, setUserError] = useState<string|null>(null)
  const [userData, setUserData] = useState<UserData>(emptyUser)

  const showError = (title: string, description?: string) => {
    toastRef.current = toast({
      status: 'error',
      title,
      description,
    })
  }

  const showSuccess = (title: string, description?: string) => {
    toastRef.current = toast({
      status: 'success',
      title,
      description,
    })
  }

  const storeUser = (user: string) => {
    setUserError(null)
    setUserData(emptyUser)
    if (!user.length) {
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      client.current?.get(`/user/${user}`)
        .then(({data}: {data: UserData}) => {
          setUserData(data)
        }).catch(() => {
          setUserError('Invalid user hash')
        })
    }, 500)
  }

  const clearData = () => {
    setUserData(emptyUser)
    setUser('')
  }

  const saveToken = () => {
    if (!tokenRef.current) {
      return showError('try again')
    }

    if (!tokenRef.current.value.length) {
      setToken('')
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      axios.get(`${API_BASE}/users`, {headers: {Authorization: `Bearer ${tokenRef.current?.value}`}})
        .then(() => {
          setToken(tokenRef.current?.value as string)
          showSuccess('Token is valid')
          client.current = axios.create({
            baseURL: API_BASE,
            headers: {
              Authorization: `Bearer ${tokenRef.current?.value}`,
            },
          })
        })
        .catch(() => {
          setToken('')
          showError('invalid token')
        })
    }, 500)
  }

  const disabled = token.length === 0 || (user.length === 0 || !userData)

  return (
    <Stack mx={'auto'} maxW={'xl'} py={12} px={6}>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}>
        <Stack spacing={6}>
            <FormControl id='token'>
              <FormLabel>Token</FormLabel>
              <Input
                type='text'
                ref={tokenRef}
                onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) => {
                  if (e.key !== 'Enter') {
                    return
                  }
                  saveToken()
                }}
                onChange={saveToken}
              />
            </FormControl>
        </Stack>
        <If condition={token.length !== 0}>
          <Then>
            <Stack spacing={6} mt={6}>
              <Divider />
              <Heading size='lg'>
                User actions
                <Button onClick={clearData} rightIcon={<DeleteIcon />} size='xs' ml={5} ref={clearRef}>
                  Clear data
                </Button>
              </Heading>
              <Queries
                client={client.current as AxiosInstance}
                showError={showError}
                setUser={setUser}
                setUserData={setUserData}
                clearRef={clearRef}
              />
              <FormControl id='user' isInvalid={userError !== null}>
                <FormLabel>User (hash)</FormLabel>
                <Input
                  type='text'
                  disabled={client.current === null}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUser(e.target.value)
                    storeUser(e.target.value)
                  }}
                  value={user}
                />
                <FormErrorMessage>{userError}</FormErrorMessage>
              </FormControl>
              <If condition={!disabled}>
                <Then>
                  <UserDataDisplay data={userData} />
                </Then>
              </If>
              <If condition={!disabled}>
                <Then>
                  <UserActions
                    client={client.current as AxiosInstance}
                    user={userData}
                    setUserData={setUserData}
                    showError={showError}
                    showSuccess={showSuccess}
                  />
                  <FakePin
                    client={client.current as AxiosInstance}
                    user={userData}
                    setUser={setUser}
                    setUserData={setUserData}
                    showError={showError}
                    showSuccess={showSuccess}
                  />
                </Then>
              </If>
            </Stack>
          </Then>
        </If>
      </Box>
    </Stack>
  )
}

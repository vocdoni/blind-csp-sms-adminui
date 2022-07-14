import { DeleteIcon } from '@chakra-ui/icons'
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
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { If, Then } from 'react-if'

import FakePin from '../components/FakePin'
import Queries from '../components/Queries'
import UserDataDisplay from '../components/UserDataDisplay'
import UserActions from '../components/UserActions'
import { API_BASE } from '../constants'
import { UserData } from '../types'
import { enterCallback } from '../utils'

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
  const baseRef = useRef<HTMLInputElement>(null)
  const clearRef = useRef<HTMLButtonElement>(null)
  const toastRef = useRef<ToastId>()
  const toast = useToast()
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const client = useRef<AxiosInstance>()
  const [userError, setUserError] = useState<string|null>(null)
  const [userData, setUserData] = useState<UserData>(emptyUser)
  const [apiBase, setApiBase] = useState<string>('')

  const showError = useCallback((title: string, description?: string) => {
    toastRef.current = toast({
      status: 'error',
      title,
      description,
    })
  }, [toast])

  const showSuccess = useCallback((title: string, description?: string) => {
    toastRef.current = toast({
      status: 'success',
      title,
      description,
    })
  }, [toast])

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
      axios.get(`${apiBase}/users`, {headers: {Authorization: `Bearer ${tokenRef.current?.value}`}})
        .then(() => {
          setToken(tokenRef.current?.value as string)
          showSuccess('Token is valid')
          client.current = axios.create({
            baseURL: apiBase,
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

  const saveAPIBase = useCallback(() => {
    if (!baseRef.current) {
      return showError('try again')
    }

    const base = baseRef.current.value
    if (!base.length) {
      setApiBase('')
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      axios.get(base)
        .catch((e) => {
          switch (e.request.status) {
            case 405:
              showSuccess('API base seems valid')
              setApiBase(base)
              break
            default:
              setApiBase('')
              showError('invalid API base')
          }
        })
    }, 500)
  }, [showError, showSuccess])

  useEffect(() => {
    if (apiBase.length > 0) return
    saveAPIBase()
  }, [apiBase, saveAPIBase])

  const disabled = token.length === 0 || (user.length === 0 || !userData)

  return (
    <Stack mx={'auto'} maxW={'xl'} px={6}>
      <Box
        rounded={'lg'}
        bg={useColorModeValue('white', 'gray.700')}
        boxShadow={'lg'}
        p={8}
        pt={6}
      >
        <Stack spacing={6}>
          <FormControl id='token'>
            <FormLabel>API base</FormLabel>
            <Input
              type='text'
              ref={baseRef}
              defaultValue={API_BASE}
              onKeyUp={(e) => enterCallback(e, saveAPIBase)}
              onChange={saveAPIBase}
            />
          </FormControl>
          <If condition={apiBase.length > 0}>
            <Then>
              <FormControl id='token'>
                <FormLabel>Token</FormLabel>
                <Input
                  type='text'
                  ref={tokenRef}
                  onKeyUp={(e) => enterCallback(e, saveToken)}
                  onChange={saveToken}
                />
              </FormControl>
            </Then>
          </If>
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

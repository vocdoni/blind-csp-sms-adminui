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
import PhoneUpdate from '../components/PhoneUpdate'
import CreateUser from '../components/CreateUser'
import { ResetUser, SetUser, useUserReducer } from '../hooks/use-user-reducer'

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
  const [userData, userDispatch] = useUserReducer()
  const [apiBase, setApiBase] = useState<string>('')
  const [initialized, setInitialized] = useState<boolean>(false)

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
    userDispatch({type: ResetUser})

    if (!user.length) {
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      client.current?.get(`/user/${user}`)
        .then(({data}: {data: UserData}) => {
          userDispatch({type: SetUser, payload: data})
        }).catch(() => {
          setUserError('Invalid user hash')
        })
    }, 500)
  }

  const clearData = () => {
    userDispatch({type: ResetUser})
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
      axios.get(`${base}/ping`)
        .then(({data}) => {
          if (data !== '.\n') {
            throw new Error('Pong not received')
          }
          showSuccess('API base seems valid')
          setApiBase(base)
        })
        .catch((e) => {
          setApiBase('')
          showError('invalid API base')
        })
    }, 500)
  }, [showError, showSuccess])

  // Store the default api base value (set as `defaultValue` and configurable via env vars)
  useEffect(() => {
    if (apiBase.length > 0 || initialized) return
    setInitialized(true)
    saveAPIBase()
  }, [apiBase, saveAPIBase, initialized])

  // Ask before closing in case there's a token stored in state
  const exitHandler = (e: BeforeUnloadEvent) => e.preventDefault()
  useEffect(() => {
    if (!token.length) return

    window.addEventListener('beforeunload', exitHandler, {capture: true})
    return () => {
      window.removeEventListener('beforeunload', exitHandler, {capture: true})
    }
  }, [token])

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
        <If condition={apiBase.length !== 0 && token.length !== 0}>
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
                clearRef={clearRef}
                userDispatch={userDispatch}
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
                    userDispatch={userDispatch}
                    showError={showError}
                    showSuccess={showSuccess}
                  />
                  <PhoneUpdate
                    client={client.current as AxiosInstance}
                    user={userData}
                    userDispatch={userDispatch}
                    showError={showError}
                    showSuccess={showSuccess}
                  />
                  <FakePin
                    client={client.current as AxiosInstance}
                    user={userData}
                    userDispatch={userDispatch}
                    setUser={setUser}
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

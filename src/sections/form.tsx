import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  useColorModeValue,
  useToast,
  ToastId,
  FormErrorMessage,
  HStack,
  Heading,
  Divider,
} from '@chakra-ui/react'
import axios, { AxiosInstance } from 'axios'
import React, { useRef, useState } from 'react'
import { If, Then } from 'react-if'
import FakePin from '../components/FakePin'
import CreateUser from '../components/CreateUser'
import { API_BASE } from '../constants'
import Queries from '../components/Queries'

type Election = {
  electionId: string
  remainingAttempts: number
  consumed: boolean
  challenge: number
}

type UserData = {
  userID: string
  elections: Election[]
  extraData: string
  phone: {
    country_code: number
    national_number: number
  }
}

const emptyUser : UserData = {
  userID: '',
  elections: [],
  extraData: '',
  phone: {
    country_code: 0,
    national_number: 0,
  }
}

export default function Form() {
  const tokenRef = useRef<HTMLInputElement>(null)
  const toastRef = useRef<ToastId>()
  const toast = useToast()
  const [token, setToken] = useState<string>('')
  const [user, setUser] = useState<string>('')
  const timeoutRef = useRef<NodeJS.Timeout>()
  const client = useRef<AxiosInstance>()
  const [userError, setUserError] = useState<string|null>(null)
  const [userIsValid, setUserIsValid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [userData, setUserData] = useState<UserData>(emptyUser)

  const showError = (title: string, description?: string) => {
    toastRef.current = toast({
      status: 'error',
      title,
      description,
    })
  }

  const showSuccess = (title: string) => {
    toastRef.current = toast({
      status: 'success',
      title,
    })
  }

  const updateUser = (user: string) => {
    if (!user.length) {
      return
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      setUserError(null)
      client.current?.get(`/user/${user}`)
        .then(({data}: {data: UserData}) => {
          setUserIsValid(true)
          setUserData(data)
        }).catch(() => {
          setUserIsValid(false)
          setUserError('Invalid user hash')
        })
    }, 500)
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

  const disabled = token.length === 0 || (user.length === 0 || !userIsValid)

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
              <Heading size='lg'>User actions</Heading>
              <FormControl id='user' isInvalid={userError !== null}>
                <FormLabel>User (hash)</FormLabel>
                <Input
                  type='text'
                  disabled={client.current === null}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setUser(e.target.value)
                    updateUser(e.target.value)
                  }}
                  value={user}
                />
                <FormErrorMessage>{userError}</FormErrorMessage>
              </FormControl>
              <Queries />
              <If condition={!disabled}>
                <Then>
                  <HStack w='full' alignItems='stretch' display='flex'>
                    <Button
                      disabled={disabled || loading}
                      isLoading={loading}
                      w='full'
                      onClick={() => {
                        setLoading(true)
                        ;(async () => {
                          const [ election ] = userData.elections
                          const attempts = 5 - election.remainingAttempts
                          let successful = 0
                          if (!attempts) {
                            showSuccess('User already has 5 attempts')
                            return setLoading(false)
                          }
                          for (let i = 0; i < attempts; i++) {
                            await client.current?.get(`/addAttempt/${user}/${election.electionId}`)
                              .then(() => {
                                successful++
                              })
                              .catch((e) => {
                                console.error(`error adding attempt to user ${user}:`, e)
                                showError('Error adding attempt', 'Check console for more details')
                              })
                          }
                          if (successful === attempts) {
                            showSuccess('SMS attempts reset successfully')
                          }
                          setLoading(false)
                        })()
                      }}>
                      Reset 5 SMS limit
                    </Button>
                    <Button
                      disabled={disabled || loading}
                      isLoading={loading}
                      w='full'
                      onClick={() => {
                        setLoading(true)
                        ;(async () => {
                          const [ election ] = userData.elections
                          if (!election) {
                            showSuccess('User has no access to any election')
                            return setLoading(false)
                          }
                          if (!election.consumed) {
                            showSuccess('Status was already set to NOT consumed')
                            return setLoading(false)
                          }
                          await client.current?.get(`/setConsumed/${user}/${election.electionId}/false`).catch((e) => {
                            console.error(`error setting consumed to user ${user}:`, e)
                            showError('Sorry, couldn\'t do that', 'Check console for more details')
                          })
                          showSuccess('SMS attempts reset successfully')
                          setLoading(false)
                        })()
                      }}>
                      Set NOT consumed
                    </Button>
                  </HStack>
                  <FakePin
                    showError={showError}
                    client={client.current}
                  />
                </Then>
              </If>
              <CreateUser
                showError={showError}
                client={client.current}
              />
            </Stack>
          </Then>
        </If>
      </Box>
    </Stack>
  )
}

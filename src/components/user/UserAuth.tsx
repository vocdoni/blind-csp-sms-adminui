import { LockIcon } from '@chakra-ui/icons'
import {
  Button,
  Code,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  ListItem,
  OrderedList,
  Text,
  useToast
} from '@chakra-ui/react'
import { useApi } from '@hooks/use-api'
import { useUser } from '@hooks/use-user'
import { SetConsumed, SetRemainingAttempts } from '@hooks/use-user-reducer'
import { UserAuthProps } from '@localtypes'
import { enterCallback, formatError } from '@utils'
import { useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'

const UserAuth = ({election}: UserAuthProps) => {
  const { client} = useApi()
  const { user, dispatch, setConsumed } = useUser()
  const toast = useToast()
  const otpRef = useRef<HTMLInputElement>(null)
  const [ checking, setChecking ] = useState<boolean>(false)
  const [ error, setError ] = useState<string | boolean>(false)
  const [ requesting, setRequesting ] = useState<boolean>(false)
  const [ requested, setRequested ] = useState<boolean>(false)
  const [ response, setResponse ] = useState<string>('Response token from step 2 will appear here')
  const [ token, setToken ] = useState<string>('')

  const request = async () => {
    setRequesting(true)
    try {
      const { data } = await client.post(`/v1/auth/elections/${election.electionId}/blind/auth/0`, {
        authData: [user.userID],
      })
      if (!data.authToken) {
        throw new Error('Token not received')
      }
      dispatch({
        type: SetRemainingAttempts,
        payload: {
          process: election.electionId,
          attempts: election.remainingAttempts - 1,
        },
      })
      setToken(data.authToken)
      setRequested(true)
    } catch (e) {
      toast({
        status: 'error',
        title: 'Got error requesting OTP',
        description: formatError(e).message,
      })
      console.warn('Got error requesting OTP:', e)
    }
    setRequesting(false)
  }

  const check = async () => {
    setError(false)

    if (!otpRef.current) {
      return
    }

    const otp = otpRef.current.value

    setChecking(true)
    try {
      const { data } = await client.post(`/v1/auth/elections/${election.electionId}/blind/auth/1`, {
        authData: [otp],
        authToken: token,
      })
      if (!data.token) {
        throw new Error('Token not received')
      }
      dispatch({
        type: SetConsumed,
        payload: {
          process: election.electionId,
          consumed: true,
        },
      })
      setResponse(data.token)
    } catch (e) {
      setRequested(false)
      setError(formatError(e).message)
      console.warn('Could not check OTP:', e)
    }
    otpRef.current.value = ''
    setChecking(false)
  }

  return (
    <>
      <If condition={!election.consumed || token}>
        <Then>
          <Text mb={2}>Test auth process</Text>
          <OrderedList spacing={2}>
            <ListItem>
              <Button
                size='sm'
                w='full'
                rightIcon={<LockIcon />}
                isLoading={requesting}
                disabled={requesting || election.consumed}
                onClick={request}
              >
                Request OTP code
              </Button>
            </ListItem>
            <ListItem>
              <FormControl id='otp' isInvalid={error !== false}>
                <InputGroup>
                  <Input
                    size='sm'
                    disabled={!requested || election.consumed}
                    type='text'
                    placeholder={`OTP code received in step 1`}
                    ref={otpRef}
                    onKeyUp={(e) => enterCallback(e, check)}
                  />
                  <InputRightElement w={28} maxH='full'>
                    <Button
                      size='xs'
                      w='full'
                      mr={1}
                      onClick={check}
                      rightIcon={<LockIcon />}
                      disabled={!requested || requesting || checking || election.consumed}
                      isLoading={checking}
                    >
                      Check OTP
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{error}</FormErrorMessage>
              </FormControl>
            </ListItem>
            <ListItem>
              <Code display='inline'>
                {response}
              </Code>
            </ListItem>
          </OrderedList>
        </Then>
        <Else>
          Election auth is consumed
          <Button size='sm' ml={4} onClick={() => setConsumed(election.electionId, false)}>
            set it as not consumed
          </Button>
        </Else>
      </If>
    </>
  )
}

export default UserAuth

import { PlusSquareIcon, RepeatIcon } from '@chakra-ui/icons'
import { FormControl, Heading, HStack, IconButton, Input } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { FakePinProps } from '../types'
import { generateHashFromValues } from '../utils'

const FakePin = ({showError, showSuccess, user, client, setUser, setUserData}: FakePinProps) => {
  const codeRef = useRef<HTMLInputElement>(null)
  const pinRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const getRandDigits = (cut = 10) => {
    return parseInt((Math.random() * 1000000000000).toString(), 10).toString().substring(0, cut)
  }

  const generateRandomCredentials = () => {
    if (!codeRef.current || !pinRef.current) {
      return showError('try again')
    }
    codeRef.current.value = getRandDigits()
    pinRef.current.value = getRandDigits(4)
  }

  const clearFields = () => {
    if (!codeRef.current || !pinRef.current) {
      return showError('try again')
    }
    codeRef.current.value = ''
    pinRef.current.value = ''
  }

  const setNewCredentials = async () => {
    if (!codeRef.current || !pinRef.current) {
      return showError('try again')
    }

    const code = codeRef.current.value
    const pin = pinRef.current.value

    if (!code.length || !pin.length) {
      return
    }

    setLoading(true)
    const newhash = generateHashFromValues(code, pin)
    try {
      // clone user
      const response = await client.get(`/cloneUser/${user.userID}/${newhash}`)
      if (!response.data.ok) {
        throw new Error('got API failure during cloneUser')
      }
      // mark old as consumed (only if there are elections, ofc..)
      if (user.elections && Object.keys(user.elections).length > 0) {
        const [ election ] = Object.values(user.elections)
        const consumed = await client.get(`/setConsumed/${user.userID}/${election.electionId}/true`)
        if (!consumed.data.ok) {
          throw new Error('Could not set old user consumed status (setConsumed)')
        }
      }
      // retrieve the new user data (and store it to state)
      const newuser = await client.get(`/user/${newhash}`)
      if (!newuser.data.userID) {
        throw new Error('Could not fetch new user data')
      }

      setUser(newhash)
      setUserData(newuser.data)
      clearFields()
      showSuccess('User cloned successfully', 'New user data already loaded')
    } catch (e) {
      showError('Couldn\'t clone user', 'Check console for more details')
      console.error(e)
    }
    setLoading(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    setNewCredentials()
  }

  return (
    <>
      <Heading size='md'>
        Set new credentials (fake pin)
        <IconButton
          aria-label='Generate new pair'
          title='Generate new pair'
          onClick={generateRandomCredentials}
          icon={<RepeatIcon />}
          ml={4}
          size='sm'
        />
      </Heading>
      <HStack>
        <FormControl id='code'>
          <Input
            type='text'
            placeholder='New user code'
            ref={codeRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='pin'>
          <Input
            type='text'
            placeholder='New user pin'
            ref={pinRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <IconButton
          aria-label='create'
          onClick={setNewCredentials}
          icon={<PlusSquareIcon />}
          isLoading={loading}
          disabled={loading}
        />
      </HStack>
    </>
  )
}

export default FakePin

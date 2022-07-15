import { CheckIcon, RepeatIcon } from '@chakra-ui/icons'
import { Button, FormControl, Heading, HStack, IconButton, Input, VStack } from '@chakra-ui/react'
import { SetUser } from '@hooks/use-user-reducer'
import { CloneUserProps } from '@localtypes'
import { generateHashFromValues } from '@utils'
import { useRef, useState } from 'react'

const UserClone = ({showError, showSuccess, user, client, setUser, userDispatch}: CloneUserProps) => {
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
    codeRef.current.value = getRandDigits(7)
    pinRef.current.value = getRandDigits(4)
  }

  const clearFields = () => {
    if (!codeRef.current || !pinRef.current) {
      return showError('try again')
    }
    codeRef.current.value = ''
    pinRef.current.value = ''
  }

  const cloneUser = async () => {
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
      userDispatch({
        type: SetUser,
        payload: newuser.data,
      })
      clearFields()
      showSuccess('User cloned successfully', 'New user data already loaded')
    } catch (e) {
      showError('Couldn\'t clone user.', 'Try changing credentials & check console for more details')
      console.error(e)
    }
    setLoading(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    cloneUser()
  }

  return (
    <VStack align='left' spacing={3}>
      <Heading size='md'>
        Clone user
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
      </HStack>
      <Button
        onClick={cloneUser}
        rightIcon={<CheckIcon />}
        isLoading={loading}
        disabled={loading}
        w='full'
      >
        Clone user
      </Button>
    </VStack>
  )
}

export default UserClone
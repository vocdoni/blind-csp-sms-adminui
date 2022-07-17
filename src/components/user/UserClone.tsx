import { CheckIcon, RepeatIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  VStack,
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { generateHashFromValues } from '@utils'
import { useRef } from 'react'

const UserClone = () => {
  const codeRef = useRef<HTMLInputElement>(null)
  const pinRef = useRef<HTMLInputElement>(null)
  const { loading, clone } = useUser()

  const getRandDigits = (cut = 10) => {
    return parseInt((Math.random() * 1000000000000).toString(), 10).toString().substring(0, cut)
  }

  const generateRandomCredentials = () => {
    if (!codeRef.current || !pinRef.current) {
      return
    }
    codeRef.current.value = getRandDigits(7)
    pinRef.current.value = getRandDigits(4)
  }

  const clearFields = () => {
    if (!codeRef.current || !pinRef.current) {
      return
    }
    codeRef.current.value = ''
    pinRef.current.value = ''
  }

  const cloneUser = async () => {
    if (!codeRef.current || !pinRef.current) {
      return
    }

    const code = codeRef.current.value
    const pin = pinRef.current.value

    if (!code.length || !pin.length) {
      return
    }

    const newhash = generateHashFromValues(code, pin)
    if (await clone(newhash)) {
      clearFields()
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    cloneUser()
  }

  return (
    <VStack align='left'>
      <Heading size='md'>
        Clone user
        <IconButton
          aria-label='Generate new pair'
          title='Generate new pair'
          onClick={generateRandomCredentials}
          icon={<RepeatIcon />}
          ml={4}
          size='xs'
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
      >
        Clone user
      </Button>
    </VStack>
  )
}

export default UserClone

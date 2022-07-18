import { CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { useRef } from 'react'

const UserClone = () => {
  const hashRef = useRef<HTMLInputElement>(null)
  const { loading, clone } = useUser()

  const clearFields = () => {
    if (!hashRef.current) {
      return
    }
    hashRef.current.value = ''
  }

  const cloneUser = async () => {
    if (!hashRef.current) {
      return
    }

    const hash = hashRef.current.value

    if (!hash.length) {
      return
    }

    if (await clone(hash)) {
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
      </Heading>
      <HStack>
        <FormControl id='hash'>
          <Input
            type='text'
            placeholder='New user hash'
            ref={hashRef}
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

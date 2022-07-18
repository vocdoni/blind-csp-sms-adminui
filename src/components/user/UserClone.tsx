import { CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  Heading,
  Input,
  Stack,
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
    <Stack>
      <Heading size='md'>
        Clone user
      </Heading>
      <Stack direction='row'>
        <FormControl id='hash'>
          <Input
            type='text'
            placeholder='New user hash'
            ref={hashRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <Button
          onClick={cloneUser}
          rightIcon={<CheckIcon />}
          isLoading={loading}
          disabled={loading}
          px={6}
        >
          Clone user
        </Button>
      </Stack>
    </Stack>
  )
}

export default UserClone

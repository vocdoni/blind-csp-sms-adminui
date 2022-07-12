import { PlusSquareIcon } from '@chakra-ui/icons'
import { FormControl, HStack, IconButton, Input } from '@chakra-ui/react'
import { useRef, useState } from 'react'

const UserQuery = () => {
  const birthdateRef = useRef<HTMLInputElement>(null)
  const memberRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const makeQuery = () => {}

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    // setNewCredentials()
  }

  return (
    <HStack>
      <FormControl id='birthdate'>
        <Input
          type='date'
          placeholder='Birthdate'
          ref={birthdateRef}
          onKeyUp={handleKeyUp}
        />
      </FormControl>
      <FormControl id='pin'>
        <Input
          type='text'
          placeholder='New user pin'
          ref={memberRef}
          onKeyUp={handleKeyUp}
        />
      </FormControl>
      <IconButton
        aria-label='create'
        onClick={makeQuery}
        as={PlusSquareIcon}
        isLoading={loading}
        disabled={loading}
        size='xs'
      />
    </HStack>
  )
}

export default UserQuery

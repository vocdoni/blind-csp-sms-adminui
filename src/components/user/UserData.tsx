import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { If, Then } from 'react-if'
import PhoneUpdate from './PhoneUpdate'
import UserClone from './UserClone'
import UserDataDisplay from './UserDataDisplay'
import UserDelete from './UserDelete'

const UserData = () => {
  const { set, error, user, reset, hashRef } = useUser()

  return (
    <Stack w='full'>
      <FormControl id='user' isInvalid={error !== null}>
        <InputGroup>
          <Input
            type='text'
            placeholder='User hash'
            pr='6.5rem'
            ref={hashRef}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              set(e.target.value)
            }
          />
          <InputRightElement w='6.5rem'>
            <Button onClick={reset} rightIcon={<DeleteIcon />} size='xs' mr={1}>
              Clear data
            </Button>
          </InputRightElement>
        </InputGroup>
        <FormErrorMessage>{error?.message}</FormErrorMessage>
      </FormControl>
      <If condition={user.userID.length > 0}>
        <Then>
          <UserDataDisplay user={user} />
          <PhoneUpdate />
          <UserClone />
          <UserDelete />
        </Then>
      </If>
    </Stack>
  )
}

export default UserData
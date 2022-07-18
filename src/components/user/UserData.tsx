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
import UserPhoneUpdate from './UserPhoneUpdate'
import UserClone from './UserClone'
import UserDataDisplay from './UserDataDisplay'
import UserDelete from './UserDelete'
import UserElectionAdd from './UserElectionAdd'
import { RefObject } from 'react'

const UserData = ({dataRef}: {dataRef: RefObject<HTMLDivElement>}) => {
  const { set, error, user, reset, hashRef } = useUser()

  return (
    <Stack ref={dataRef}>
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
          <Stack spacing={6}>
            <UserPhoneUpdate />
            <UserElectionAdd />
            <UserClone />
            <UserDelete />
          </Stack>
        </Then>
      </If>
    </Stack>
  )
}

export default UserData

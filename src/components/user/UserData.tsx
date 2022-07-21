import { DeleteIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormErrorMessage,
  Input,
  InputGroup,
  InputRightElement,
  Stack
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { UserCreateProvider } from '@hooks/use-user-create'
import { RefObject } from 'react'
import { If, Then } from 'react-if'
import UserClone from './UserClone'
import UserCreateButton from './UserCreateButton'
import UserDataDisplay from './UserDataDisplay'
import UserDelete from './UserDelete'
import UserEdit from './UserEdit'
import UserElectionAdd from './UserElectionAdd'

const UserData = ({dataRef}: {dataRef: RefObject<HTMLDivElement>}) => {
  const { set, error, user, reset, hashRef } = useUser()

  return (
    <Stack ref={dataRef}>
      <UserCreateProvider>
        <Stack direction='row'>
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
          <UserCreateButton />
        </Stack>
        <If condition={user.userID.length > 0}>
          <Then>
            <UserDataDisplay user={user} />
            <UserEdit />
            <Stack spacing={6}>
              <UserElectionAdd />
              <UserClone />
              <UserDelete />
            </Stack>
          </Then>
        </If>
      </UserCreateProvider>
    </Stack>
  )
}

export default UserData

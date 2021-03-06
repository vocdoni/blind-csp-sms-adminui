import { EditIcon } from '@chakra-ui/icons'
import { Box, Heading, IconButton, Tag, useColorMode, VStack } from '@chakra-ui/react'
import { useUserCreate } from '@hooks/use-user-create'
import { UserData } from '@localtypes'
import { hidePhoneNumber } from '@utils'
import { Else, If, Then } from 'react-if'
import ElectionRow from '../ElectionRow'

const EditButton = ({action}: {action: () => void}) => (
  <IconButton
    aria-label='Edit'
    title='Edit'
    size='xs'
    ml={5}
    icon={<EditIcon />}
    onClick={action}
  />
)

const UserDataDisplay = ({user}: {user: UserData }) => {
  const { colorMode } = useColorMode()
  const { edit } = useUserCreate()

  const phone = '+' + user.phone.country_code + hidePhoneNumber(user.phone.national_number.toString())

  return (
    <VStack spacing={2} align='left' p={3} layerStyle={`code${colorMode}`}>
      <Heading size='sm'>User ID</Heading>
      <Box textOverflow='ellipsis' overflow='hidden' whiteSpace='pre' title={user.userID}>
        {user.userID}
      </Box>
      <Box>
        <Heading size='xs'>Phone</Heading>
        {phone}
        <EditButton action={edit.onOpen} />
      </Box>
      <Heading size='sm'>Extra data</Heading>
      <Box>
        {user.extraData}
        <EditButton action={edit.onOpen} />
      </Box>
      <If condition={user.elections && Object.keys(user.elections).length > 0}>
        <Then>
          {() => (
            <>
              <Heading size='sm'>Processes</Heading>
              {
                Object.values(user.elections).map((election, k) =>
                  <ElectionRow key={k} election={election} />
                )
              }
            </>
          )}
        </Then>
        <Else>
          <Tag colorScheme='red'>There are no processes linked to this user</Tag>
        </Else>
      </If>
    </VStack>
  )
}

export default UserDataDisplay

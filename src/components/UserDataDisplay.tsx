import { Box, Heading, Tag, useColorMode, VStack } from '@chakra-ui/react'
import { Else, If, Then } from 'react-if'
import { UserData } from '../types'
import ElectionRow from './ElectionRow'

const UserDataDisplay = ({data}: {data: UserData }) => {
  const { colorMode } = useColorMode()

  return (
    <VStack spacing={2} align='left' p={3} layerStyle={`code${colorMode}`}>
      <Heading size='sm'>User ID</Heading>
      <Box textOverflow='ellipsis' overflow='hidden' w='full' whiteSpace='pre' title={data.userID}>
        {data.userID}
      </Box>
      <Box>
        +{data.phone.country_code}{data.phone.national_number}
      </Box>
      <If condition={data.elections && Object.keys(data.elections).length > 0}>
        <Then>
          {() => (
            <>
              <Heading size='sm'>Processes</Heading>
              {
                Object.values(data.elections).map((election, k) => <ElectionRow key={k} election={election} />)
              }
            </>
          )}
        </Then>
        <Else>
          <Tag colorScheme='red'>There are no processes linked to this user</Tag>
        </Else>
      </If>
      <Heading size='sm'>Extra data</Heading>
      <Box>
        {data.extraData}
      </Box>
    </VStack>
  )
}

export default UserDataDisplay

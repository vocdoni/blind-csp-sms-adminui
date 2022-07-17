import { Box, Stack, useColorModeValue } from '@chakra-ui/react'
import ApiFields from '@components/ApiFields'
import UserData from '@components/user/UserData'
import UserQuery from '@components/user/UserQuery'
import { useApi } from '@hooks/use-api'
import { If, Then } from 'react-if'

const Manager = () => {
  const { token } = useApi()

  return (
    <Stack maxW='6xl' mx='auto' px={[2, 6]} mb={24} mt={4}>
      <Stack direction='row'>
        <ApiFields />
      </Stack>
      <If condition={token.valid}>
        <Then>
          <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={[4, 8]}
            pt={[4, 6]}
          >
            <Stack direction={['column', 'column', 'row']} spacing={0}>
              <Box w='full' maxW={['100%', '100%', '50%']}>
                <UserQuery />
              </Box>
              <Box w='full' maxW={['100%', '100%', '50%']} pl={2}>
                <UserData />
              </Box>
            </Stack>
          </Box>
        </Then>
      </If>
    </Stack>
  )
}

export default Manager

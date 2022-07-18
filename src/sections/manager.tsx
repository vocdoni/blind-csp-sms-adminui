import { Box, Stack, useColorModeValue } from '@chakra-ui/react'
import ApiFields from '@components/ApiFields'
import UserData from '@components/user/UserData'
import UserQuery from '@components/user/UserQuery'
import { useApi } from '@hooks/use-api'
import { useRef } from 'react'
import { If, Then } from 'react-if'

const Manager = () => {
  const { token } = useApi()
  const dataRef = useRef<HTMLDivElement>(null)

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
            <Stack direction={['column', 'column', 'row']} spacing={0} rowGap={4}>
              <Box w='full' maxW={['100%', '100%', '50%']}>
                <UserQuery dataRef={dataRef} />
              </Box>
              <Box w='full' maxW={['100%', '100%', '50%']} pl={[0, 0, 6]}>
                <UserData dataRef={dataRef} />
              </Box>
            </Stack>
          </Box>
        </Then>
      </If>
    </Stack>
  )
}

export default Manager

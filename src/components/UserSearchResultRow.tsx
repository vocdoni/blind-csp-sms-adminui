import { Box, Heading, HStack, Tag, Text, useColorMode, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { SetUser } from '../hooks/use-user-reducer'
import { UserData, UserSearchResultRowProps } from '../types'

const UserSearchResultRow = ({hash, client, setUser: setUserHash, userDispatch}: UserSearchResultRowProps) => {
  const [loaded, setLoaded] = useState(false)
  const [user, setUser] = useState<UserData>()
  const { colorMode } = useColorMode()

  useEffect(() => {
    ;(async () => {
      if (loaded) return
      const response = await client.get(`/user/${hash}`)
      setLoaded(true)
      setUser(response.data)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, hash])

  if (!user) {
    return null
  }

  const onClick = () => {
    setUserHash(hash)
    userDispatch({
      type: SetUser,
      payload: user,
    })
  }

  const styles = {
    cursor: 'pointer',
    '.results-list &:nth-of-type(odd)': {
      backgroundColor: colorMode === 'dark'
        ? 'var(--chakra-colors-gray-800)'
        : 'var(--chakra-colors-gray-50)',
    },
    '&:hover': {
      backgroundColor: colorMode === 'dark'
        ? 'var(--chakra-colors-gray-600) !important'
        : 'var(--chakra-colors-gray-100) !important',
    },
  }

  return (
    <Box p={3} sx={styles} onClick={onClick}>
      <VStack align='left'>
        <HStack>
          <Text overflow='hidden' textOverflow='ellipsis' w='full' whiteSpace='pre' title={user.userID}>
            {user.userID}
          </Text>
          <Tag colorScheme='blue' minW='5rem'>
            <span>{user.elections ? Object.keys(user.elections).length : 0}</span>&nbsp;elections
          </Tag>
        </HStack>
        <Box>
          <Heading size='xs'>Extra data</Heading>
          {user.extraData}
        </Box>
        <Box>
          <Heading size='xs'>Phone</Heading>
          +{user.phone.country_code}{user.phone.national_number}
        </Box>
      </VStack>
    </Box>
  )
}

export default UserSearchResultRow

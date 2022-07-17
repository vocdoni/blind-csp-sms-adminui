import { Box, Heading, HStack, Tag, Text, useColorMode, VStack } from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { Set } from '@hooks/use-user-reducer'
import { UserSearchResultRowProps } from '@localtypes'
import { hidePhoneNumber } from '@utils'
import { useEffect, useState } from 'react'

const UserSearchResultRow = ({hash}: UserSearchResultRowProps) => {
  const { colorMode } = useColorMode()
  const { dispatch, get, hashRef, indexed } = useUser()
  const [ loaded, setLoaded ] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (loaded) return
      if (!indexed[hash]) {
        await get(hash)
      }
      setLoaded(true)
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, hash, indexed])

  const onClick = () => {
    dispatch({
      type: Set,
      payload: user,
    })
    if (!hashRef.current) {
      return
    }
    hashRef.current.value = user.userID
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

  const user = indexed[hash]
  if (!user) return null

  const phone = '+' + user.phone.country_code + hidePhoneNumber(user.phone.national_number.toString())

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
          <Heading size='xs'>Phone</Heading>
          {phone}
        </Box>
        <Box>
          <Heading size='xs'>Extra data</Heading>
          {user.extraData}
        </Box>
      </VStack>
    </Box>
  )
}

export default UserSearchResultRow

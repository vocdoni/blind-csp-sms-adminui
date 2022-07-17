import { SearchIcon } from '@chakra-ui/icons'
import { FormControl, IconButton, Input, Stack, Tag } from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { enterCallback } from '@utils'
import { useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'
import UserSearchResultRow from './UserSearchResultRow'

const UserQuery = () => {
  const birthdateRef = useRef<HTMLInputElement>(null)
  const memberRef = useRef<HTMLInputElement>(null)
  const [ loading, setLoading ] = useState(false)
  const [ loaded, setLoaded ] = useState(false)
  const { search, searchResults: results } = useUser()

  const makeQuery = async () => {
    setLoaded(false)
    if (!birthdateRef.current || !memberRef.current) {
      return
    }

    const birthday = birthdateRef.current.value
    const member = memberRef.current.value

    const term = [member, birthday.replace(/-/g, '')].join('')

    setLoading(true)
    try {
      await search(term)
      term.trim().length > 0 && setLoaded(true)
    } catch (e) {
      setLoaded(false)
    }
    setLoading(false)
  }

  return (
    <Stack w='full'>
      <Stack direction='row'>
        <FormControl id='birthdate'>
          <Input
            type='date'
            ref={birthdateRef}
            title='Birthdate'
            onKeyUp={(e) => enterCallback(e, makeQuery)}
          />
        </FormControl>
        <FormControl id='member'>
          <Input
            type='text'
            placeholder={`member id`}
            ref={memberRef}
            onKeyUp={(e) => enterCallback(e, makeQuery)}
          />
        </FormControl>
        <IconButton
          aria-label='create'
          onClick={makeQuery}
          icon={<SearchIcon />}
          isLoading={loading}
          disabled={loading}
        />
      </Stack>
      <If condition={loaded && results && results.length > 0}>
        <Then>
          {() => (
              <Stack align='left' className='results-list'>
              {
                results.map((hash, k) =>
                  <UserSearchResultRow key={k} hash={hash} />
                )
              }
              </Stack>
            )
          }
        </Then>
        <Else>
          <If condition={(loaded && !results) || (loaded && results && !results.length)}>
            <Then>
              <Tag colorScheme='yellow'>No results</Tag>
            </Then>
          </If>
        </Else>
      </If>
    </Stack>
  )
}

export default UserQuery

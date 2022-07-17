import { SearchIcon } from '@chakra-ui/icons'
import { FormControl, IconButton, Input, Stack, Tag } from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { enterCallback } from '@utils'
import { useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'
import UserSearchResultRow from './UserSearchResultRow'

const UserQuery = () => {
  const termRef = useRef<HTMLInputElement>(null)
  const [ loading, setLoading ] = useState(false)
  const [ loaded, setLoaded ] = useState(false)
  const { search, searchResults: results } = useUser()

  const makeQuery = async () => {
    setLoaded(false)
    if (!termRef.current) {
      return
    }

    const term = termRef.current.value

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
        <FormControl id='member'>
          <Input
            type='text'
            placeholder={`search term`}
            ref={termRef}
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

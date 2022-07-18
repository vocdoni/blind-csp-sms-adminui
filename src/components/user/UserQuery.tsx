import { HamburgerIcon, SearchIcon, SmallCloseIcon } from '@chakra-ui/icons'
import { ButtonGroup, FormControl, IconButton, Input, InputGroup, InputRightElement, Stack, Tag } from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { enterCallback } from '@utils'
import { RefObject, useRef, useState } from 'react'
import { Else, If, Then } from 'react-if'
import UserSearchResultRow from './UserSearchResultRow'

const UserQuery = ({dataRef}: {dataRef: RefObject<HTMLDivElement>}) => {
  const termRef = useRef<HTMLInputElement>(null)
  const [ loading, setLoading ] = useState(false)
  const [ loaded, setLoaded ] = useState(false)
  const { getAll, search, searchResults: results } = useUser()

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

  const findAll = async () => {
    setLoaded(false)
    setLoading(true)
    if (termRef.current) {
      termRef.current.value = ''
    }

    try {
      await getAll()
      setLoaded(true)
    } catch (e) {
      setLoaded(false)
    }
    setLoading(false)
  }

  const resultsLoaded = loaded && results && results.length > 0

  return (
    <Stack>
      <Stack direction='row'>
        <FormControl id='member'>
          <InputGroup>
            <Input
              type='text'
              placeholder={`search term`}
              ref={termRef}
              onKeyUp={(e) => enterCallback(e, makeQuery)}
            />
            <InputRightElement width={16}>
              <ButtonGroup isAttached>
                <IconButton
                  aria-label='Clear results'
                  title='Clear results'
                  variant='ghost'
                  size='xs'
                  onClick={() => {
                    search('')
                    setLoaded(false)
                    if (!termRef.current) return

                    termRef.current.value = ''
                    termRef.current.focus()
                  }}
                  icon={<SmallCloseIcon />}
                  disabled={!resultsLoaded}
                />
                <IconButton
                  aria-label='Search'
                  title='Search'
                  size='xs'
                  onClick={makeQuery}
                  icon={<SearchIcon />}
                  isLoading={loading}
                  disabled={loading}
                />
              </ButtonGroup>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <IconButton
          aria-label='Get all users'
          title='Get all users'
          icon={<HamburgerIcon />}
          isLoading={loading}
          onClick={findAll}
        />
      </Stack>
      <If condition={loaded && results && results.length > 0}>
        <Then>
          {() => (
              <Stack align='left' className='results-list'>
              {
                results.map((hash, k) =>
                  <UserSearchResultRow key={k} hash={hash} dataRef={dataRef} />
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

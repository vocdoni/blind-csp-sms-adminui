import { SearchIcon } from '@chakra-ui/icons'
import { FormControl, HStack, IconButton, Input, VStack } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import { If, Then } from 'react-if'
import { UserQueryProps } from '../types'
import UserSearchResultRow from './UserSearchResultRow'

const FindUserByExtraData = ({client, showError, clearRef, ...props} : UserQueryProps) => {
  const birthdateRef = useRef<HTMLInputElement>(null)
  const [eventIsSet, setEventIsSet] = useState<boolean>(false)
  const memberRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [results, setResults] = useState<string[]>([])

  useEffect(() => {
    if (!clearRef.current || eventIsSet) return
    setEventIsSet(true)
    clearRef.current.addEventListener('click', (e) =>  {
      setResults([])

      if (!memberRef.current) return
      memberRef.current.value = ''
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearRef.current, eventIsSet])

  const makeQuery = async () => {
    if (!birthdateRef.current || !memberRef.current) {
      return showError('try again')
    }

    const birthday = birthdateRef.current.value
    const member = memberRef.current.value

    const term = [member, birthday.replace(/-/g, '')].join(' ')

    setLoading(true)
    try {
      const results = await client.post('/search', {term})
      setResults(results.data.users)
    } catch (e) {
      showError('Error searching member', 'Check console for details')
      console.error(e)
    }
    setLoading(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    makeQuery()
  }

  return (
    <>
      <HStack>
        <FormControl id='birthdate'>
          <Input
            type='date'
            ref={birthdateRef}
            title='Birthdate'
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='member'>
          <Input
            type='text'
            placeholder={`Member id`}
            ref={memberRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <IconButton
          aria-label='create'
          onClick={makeQuery}
          icon={<SearchIcon />}
          isLoading={loading}
          disabled={loading}
        />
      </HStack>
      <If condition={results && results.length > 0}>
        <Then>
          {() => (
              <VStack align='left' className='results-list'>
              {
                results.map((hash, k) =>
                  <UserSearchResultRow
                    key={k}
                    hash={hash}
                    client={client}
                    showError={showError}
                    {...props}
                  />
                )
              }
              </VStack>
            )
          }
        </Then>
      </If>
    </>
  )
}

export default FindUserByExtraData

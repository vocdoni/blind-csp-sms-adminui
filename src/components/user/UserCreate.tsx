import { Button, FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react'
import { CreateUserProps } from '@localtypes'
import React, { useRef, useState } from 'react'


const UserCreate = ({showError, client} : CreateUserProps) => {
  const extraRef = useRef<HTMLInputElement>(null)
  const hashRef = useRef<HTMLInputElement>(null)
  const electionRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const createUser = async () => {
    if (!hashRef.current || !electionRef.current || !extraRef.current) {
      return showError('try again')
    }

    const extra = extraRef.current.value
    const hash = hashRef.current.value
    const election = electionRef.current.value

    if (!hash.length || !election.length || !extra.length || loading) {
      return showError('Required fields are missing')
    }

    setLoading(true)
    try {
      const response = await client.post(`/newUser/${hash}`, {
        extra,
        phone: 'missing :|',
      })
      if (!response.data.ok) {
        throw new Error('API said KO')
      }
    } catch (e) {
      showError('There was an error creating the user', 'Check the console for more details')
      console.error(e)
    }
    setLoading(false)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    createUser()
  }

  return (
    <>
      <Heading size='md'>Create user assigned to election</Heading>
      <VStack>
        <FormControl id='extra'>
          <FormLabel>Extra data</FormLabel>
          <Input
            type='text'
            placeholder='memberid2021 memberid2022 birthdate'
            ref={extraRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='hash'>
          <FormLabel>Member id</FormLabel>
          <Input
            type='text'
            ref={hashRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='election'>
          <FormLabel>Election ID</FormLabel>
          <Input
            type='text'
            ref={electionRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <Button
          aria-label='create'
          onClick={createUser}
          isLoading={loading}
          disabled={loading}
          size='sm'
        >
          Create user
          </Button>
      </VStack>
    </>
  )
}

export default UserCreate

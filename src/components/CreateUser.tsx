import { Button, FormControl, FormLabel, Heading, Input, VStack } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { CreateUserProps } from '../types'
import { generateHashFromValues } from '../utils'


const CreateUser = ({showError, client} : CreateUserProps) => {
  const extraRef = useRef<HTMLInputElement>(null)
  const codeRef = useRef<HTMLInputElement>(null)
  const pinRef = useRef<HTMLInputElement>(null)
  const electionRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const createUser = async () => {
    if (!codeRef.current || !pinRef.current || !electionRef.current || !extraRef.current) {
      return showError('try again')
    }

    const extra = extraRef.current.value
    const code = codeRef.current.value
    const pin = pinRef.current.value
    const election = electionRef.current.value

    if (!code.length || !pin.length || !election.length || !extra.length || loading) {
      return showError('Required fields are missing')
    }

    setLoading(true)
    try {
      const hash = generateHashFromValues(code, pin)
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
        <FormControl id='code'>
          <FormLabel>Member id</FormLabel>
          <Input
            type='text'
            ref={codeRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='pin'>
          <FormLabel>User pin</FormLabel>
          <Input
            type='text'
            ref={pinRef}
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
          w='full'
          size='sm'
        >
          Create user
          </Button>
      </VStack>
    </>
  )
}

export default CreateUser

import { PlusSquareIcon } from '@chakra-ui/icons'
import { FormControl, Heading, HStack, IconButton, Input } from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import { CreateUserProps } from '../types'
import { generateHashFromValues } from '../utils'


const CreateUser = ({showError, client} : CreateUserProps) => {
  const codeRef = useRef<HTMLInputElement>(null)
  const pinRef = useRef<HTMLInputElement>(null)
  const electionRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const createUser = () => {
    if (!codeRef.current || !pinRef.current || !electionRef.current) {
      return showError('try again')
    }

    const code = codeRef.current.value
    const pin = pinRef.current.value
    const election = electionRef.current.value

    if (!code.length || !pin.length || !election.length || loading) {
      return
    }

    setLoading(true)
    const hash = generateHashFromValues(code, pin)
    console.log('hash:', hash)
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    createUser()
  }

  return (
    <>
      <Heading size='md'>Create user</Heading>
      <HStack>
        <FormControl id='code'>
          <Input
            type='text'
            placeholder='User code'
            ref={codeRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='pin'>
          <Input
            type='text'
            placeholder='User pin'
            ref={pinRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='election'>
          <Input
            type='text'
            placeholder='Election ID'
            ref={electionRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <IconButton
          aria-label='create'
          onClick={createUser}
          as={PlusSquareIcon}
          isLoading={loading}
          disabled={loading}
          size='xs'
        />
      </HStack>
    </>
  )
}

export default CreateUser

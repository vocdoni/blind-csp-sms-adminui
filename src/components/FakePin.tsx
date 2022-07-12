import { PlusSquareIcon } from '@chakra-ui/icons'
import { FormControl, Heading, HStack, IconButton, Input } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { FakePinProps } from '../types'

const FakePin = ({showError}: FakePinProps) => {
  const codeRef = useRef<HTMLInputElement>(null)
  const pinRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const setNewCredentials = () => {
    if (!codeRef.current || !pinRef.current) {
      return showError('try again')
    }

    const code = codeRef.current.value
    const pin = pinRef.current.value

    if (!code.length || !pin.length) {
      return
    }

    setLoading(true)

  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return

    setNewCredentials()
  }

  return (
    <>
      <Heading size='md'>Set new credentials (fake pin)</Heading>
      <HStack>
        <FormControl id='code'>
          <Input
            type='text'
            placeholder='New user code'
            ref={codeRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <FormControl id='pin'>
          <Input
            type='text'
            placeholder='New user pin'
            ref={pinRef}
            onKeyUp={handleKeyUp}
          />
        </FormControl>
        <IconButton
          aria-label='create'
          onClick={setNewCredentials}
          as={PlusSquareIcon}
          isLoading={loading}
          disabled={loading}
          size='xs'
        />
      </HStack>
    </>
  )
}

export default FakePin

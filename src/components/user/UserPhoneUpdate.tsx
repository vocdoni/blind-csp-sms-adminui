import { CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { enterCallback } from '@utils'
import { useRef, useState } from 'react'

const UserPhoneUpdate = () => {
  const phoneRef = useRef<HTMLInputElement>(null)
  const toast = useToast()
  const { updatePhone } = useUser()
  const [ loading, setLoading ] = useState<boolean>(false)

  const checkAndUpdatePhone = async () => {
    if (!phoneRef.current) {
      return
    }

    const phone = phoneRef.current.value
    if (!phone.length) {
      toast({
        status: 'error',
        title: 'Phone not specified',
      })
      return
    }

    if (!phone.startsWith('+')) {
      toast({
        status: 'error',
        title: 'Missing country prefix',
        description: 'Phone should start with a country prefix (i.e. +34)',
      })
      return
    }

    setLoading(true)
    if (await updatePhone(phone)) {
      phoneRef.current.value = ''
    }
    setLoading(false)
  }

  return (
    <VStack align='left' spacing={4}>
      <Heading size='md'>
        Update phone number
      </Heading>
      <HStack>
        <FormControl id='code'>
          <Input
            type='text'
            placeholder='+23712365...'
            ref={phoneRef}
            onKeyUp={(e) => enterCallback(e, checkAndUpdatePhone)}
          />
        </FormControl>
        <Button
          aria-label='Update phone'
          onClick={checkAndUpdatePhone}
          rightIcon={<CheckIcon />}
          isLoading={loading}
          disabled={loading}
          px={6}
        >
          Update
        </Button>
      </HStack>
    </VStack>
  )
}

export default UserPhoneUpdate

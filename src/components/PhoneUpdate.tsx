import { CheckIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  Heading,
  HStack,
  Input,
  VStack,
} from '@chakra-ui/react'
import { useRef, useState } from 'react'
import { PhoneNumberProps } from '../types'
import { enterCallback } from '../utils'

const PhoneUpdate = ({client, showError, showSuccess, setUserData, user} : PhoneNumberProps) => {
  const phoneRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const updatePhone = async () => {
    if (!phoneRef.current) {
      return showError('Try again')
    }

    const phone = phoneRef.current.value
    if (!phone.length) {
      return showError('Phone not specified')
    }

    if (!phone.startsWith('+')) {
      return showError('Missing country prefix', 'Phone should start with a country prefix (i.e. +34)')
    }

    setLoading(true)
    try {
      const response = await client.get(`/setPhone/${user.userID}/${phone}`)
      if (response.data.ok !== 'true') {
        throw new Error('API returned KO')
      }
      setUserData({
        ...user,
        phone: {
          // note this dirty trick is only to show the data in the UI
          country_code: parseInt(phone.substring(1, 4), 10),
          national_number: parseInt(phone.substring(4), 10),
        },
      })
      showSuccess('Phone has been updated', 'Note it is NOT updated in the extra field tho.')
      phoneRef.current.value = ''
    } catch (e) {
      showError('Could not update phone', 'Check the console for details')
      console.error(e)
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
            onKeyUp={(e) => enterCallback(e, updatePhone)}
          />
        </FormControl>
        <Button
          aria-label='Update phone'
          onClick={updatePhone}
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

export default PhoneUpdate

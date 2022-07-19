import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { useUserCreate } from '@hooks/use-user-create'
import { enterCallback } from '@utils'
import { ChangeEvent, useRef } from 'react'


const UserCreate = ({create}: {create: () => void}) => {
  const extraRef = useRef<HTMLInputElement>(null)
  const hashRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const { data, setData } = useUserCreate()

  const onChange = (e: ChangeEvent<HTMLInputElement>, field: string) => {
    let value = ''
    if (e.target.value) {
      value = e.target.value
    }
    setData({
      ...data,
      [field]: value,
    })
  }

  return (
    <>
      <VStack>
        <FormControl id='hash'>
          <FormLabel>User hash</FormLabel>
          <Input
            type='text'
            placeholder='abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe2'
            ref={hashRef}
            onChange={(e) => onChange(e, 'hash')}
            onKeyUp={(e) => enterCallback(e, create)}
            value={data?.hash}
          />
        </FormControl>
        <FormControl id='phone'>
          <FormLabel>Phone</FormLabel>
          <Input
            type='text'
            placeholder='+34623696969'
            ref={phoneRef}
            onChange={(e) => onChange(e, 'phone')}
            onKeyUp={(e) => enterCallback(e, create)}
            value={data?.phone}
          />
        </FormControl>
        <FormControl id='extra'>
          <FormLabel>Extra data</FormLabel>
          <Input
            type='text'
            placeholder='the quick brown fox jumps over the lazy dog'
            ref={extraRef}
            onChange={(e) => onChange(e, 'extra')}
            onKeyUp={(e) => enterCallback(e, create)}
            value={data?.extra || ''}
          />
        </FormControl>
      </VStack>
    </>
  )
}

export default UserCreate

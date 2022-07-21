import { FormControl, FormLabel, Input, VStack } from '@chakra-ui/react'
import { useUserCreate } from '@hooks/use-user-create'
import { UserFormStateData } from '@localtypes'
import { enterCallback } from '@utils'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Unless } from 'react-if'


const UserForm = ({method, defaults}: {method: () => void, defaults?: UserFormStateData}) => {
  const extraRef = useRef<HTMLInputElement>(null)
  const hashRef = useRef<HTMLInputElement>(null)
  const phoneRef = useRef<HTMLInputElement>(null)
  const [ hiddenHash, setHiddenHash ] = useState<boolean>(false)
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

  // Set defaults if set
  useEffect(() => {
    if (!defaults || !Object.values(data).length) return

    setData(defaults)
    setHiddenHash(true)
  }, [data, defaults, setData])

  return (
    <>
      <VStack>
        <Unless condition={hiddenHash}>
          <FormControl id='hash'>
            <FormLabel>User hash</FormLabel>
            <Input
              type='text'
              placeholder='abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe23abe2'
              ref={hashRef}
              onChange={(e) => onChange(e, 'hash')}
              onKeyUp={(e) => enterCallback(e, method)}
              value={data?.hash}
            />
          </FormControl>
        </Unless>
        <FormControl id='phone'>
          <FormLabel>Phone</FormLabel>
          <Input
            type='text'
            placeholder='+34623696969'
            ref={phoneRef}
            onChange={(e) => onChange(e, 'phone')}
            onKeyUp={(e) => enterCallback(e, method)}
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
            onKeyUp={(e) => enterCallback(e, method)}
            value={data?.extra || ''}
          />
        </FormControl>
      </VStack>
    </>
  )
}

export default UserForm

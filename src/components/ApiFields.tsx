import { FormControl, FormLabel, Input } from '@chakra-ui/react'
import { useApi } from '@hooks/use-api'
import { enterCallback } from '@utils'
import { useEffect, useRef, useState } from 'react'
import { If, Then } from 'react-if'

const ApiFields = () => {
  const tokenRef = useRef<HTMLInputElement>(null)
  const baseRef = useRef<HTMLInputElement>(null)
  const [ initialized, setInitialized ] = useState<boolean>(false)
  const { base, saveBase, saveToken } = useApi()

  // Store the default api base value (set as `defaultValue` and configurable via env vars)
  useEffect(() => {
    if (initialized) return
    setInitialized(true)
    saveBase(baseRef)
  }, [initialized, saveBase])

  return (
    <>
      <FormControl id='token'>
        <FormLabel>API base</FormLabel>
        <Input
          type='text'
          size='sm'
          ref={baseRef}
          defaultValue={base.url}
          onKeyUp={(e) => enterCallback(e, () => saveBase(baseRef))}
          onChange={() => saveBase(baseRef)}
        />
      </FormControl>
      <If condition={base.valid}>
        <Then>
          <FormControl id='token'>
            <FormLabel>Token</FormLabel>
            <Input
              type='text'
              size='sm'
              ref={tokenRef}
              onKeyUp={(e) => enterCallback(e, () => saveToken(tokenRef))}
              onChange={() => saveToken(tokenRef)}
            />
          </FormControl>
        </Then>
      </If>
    </>
  )
}

export default ApiFields
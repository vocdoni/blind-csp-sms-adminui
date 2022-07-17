import { DownloadIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/react'
import { useApi } from '@hooks/use-api'
import { useState } from 'react'

const ApiDump = () => {
  const { token, base, dump } = useApi()
  const [ loading, setLoading ] = useState<boolean>(false)

  const dumpDB = async () => {
    setLoading(true)
    await dump()
    setLoading(false)
  }

  return (
    <IconButton
      aria-label='Dump DB'
      title='Dump DB'
      icon={<DownloadIcon />}
      isLoading={loading}
      disabled={loading || !token.valid || !base.valid}
      onClick={dumpDB}
      alignSelf='end'
      size='sm'
    />
  )
}

export default ApiDump

import { IconButton } from '@chakra-ui/react'
import { useApi } from '@hooks/use-api'
import { useState } from 'react'
import { FiDownload } from 'react-icons/fi'

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
      icon={<FiDownload />}
      isLoading={loading}
      disabled={loading || !token.valid || !base.valid}
      onClick={dumpDB}
      alignSelf='end'
      variant='ghost'
      size='sm'
    />
  )
}

export default ApiDump

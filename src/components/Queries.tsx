import { Divider, Heading, VStack } from '@chakra-ui/react'
import { QueriesProps } from '../types'
import FindUserByExtraData from './FindUserByExtraData'

const Queries = (props: QueriesProps) => {
  return (
    <>
      <VStack spacing={2} align='left'>
        <Heading size='sm'>Find user</Heading>
        <FindUserByExtraData {...props} />
        <Divider />
      </VStack>
    </>
  )
}

export default Queries

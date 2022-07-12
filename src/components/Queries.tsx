import { Divider, Heading, VStack } from '@chakra-ui/react'
import UserQuery from './UserQuery'

type QueriesProps = {}

const Queries = () => {
  return (
    <>
      <VStack spacing={6} align='left'>
        <Divider />
        <Heading size='md'>Queries</Heading>
        <Heading size='sm'>Get 2022 user</Heading>
        <UserQuery />
        <Heading size='sm'>Get 2021 user</Heading>
        <UserQuery />
        <Divider />
      </VStack>
    </>
  )
}

export default Queries

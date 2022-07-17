import { Button, FormControl, Heading, Input, Stack } from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { enterCallback } from '@utils'
import { useRef } from 'react'

const UserElectionAdd = () => {
  const electionRef = useRef<HTMLInputElement>(null)
  const { addElection, loading } = useUser()

  const add = async () => {
    if (!electionRef.current) {
      return
    }

    const election = electionRef.current.value
    if (!election.length) {
      return
    }

    if (await addElection(election)) {
      electionRef.current.value = ''
    }
  }

  return (
    <>
      <Heading size='md'>Add election</Heading>
      <Stack direction='row'>
        <FormControl id='election'>
          <Input
            type='text'
            placeholder='Election id'
            ref={electionRef}
            onKeyUp={(e) => enterCallback(e, add)}
          />
        </FormControl>
        <Button onClick={add} isLoading={loading} disabled={loading}>
          Add
        </Button>
      </Stack>
    </>
  )
}

export default UserElectionAdd

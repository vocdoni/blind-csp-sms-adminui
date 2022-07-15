import { Button, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { SetConsumed, SetRemainingAttempts } from '../hooks/use-user-reducer'
import { UserActionsProps } from '../types'

const UserActions = ({client, user, showError, showSuccess, userDispatch}: UserActionsProps) => {
  const [loading, setLoading] = useState<boolean>(false)

  if (!user || !user.elections || (user.elections && !Object.values(user.elections).length)) {
    // actions take the very first election, we should not show em' unless an election is found
    return null
  }

  return (
    <HStack w='full' alignItems='stretch' display='flex'>
      <Button
        disabled={loading}
        isLoading={loading}
        w='full'
        onClick={() => {
          setLoading(true)
          ;(async () => {
            const [ election ] = Object.values(user.elections)
            const attempts = 5 - election.remainingAttempts
            let successful = 0
            if (!attempts) {
              showSuccess('User already has 5 attempts')
              return setLoading(false)
            }
            for (let i = 0; i < attempts; i++) {
              await client.get(`/addAttempt/${user.userID}/${election.electionId}`)
                // eslint-disable-next-line no-loop-func
                .then(() => {
                  successful++
                })
                .catch((e: any) => {
                  console.error(`error adding attempt to user ${user.userID}:`, e)
                  showError('Error adding attempt', 'Check console for more details')
                })
            }
            if (successful === attempts) {
              userDispatch({
                type: SetRemainingAttempts,
                payload: {
                  process: election.electionId,
                  attempts: 5,
                }
              })
              showSuccess('SMS attempts reset successfully')
            }
            setLoading(false)
          })()
        }}>
        Reset 5 SMS limit
      </Button>
    </HStack>
  )
}

export default UserActions

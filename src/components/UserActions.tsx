import { Button, HStack } from '@chakra-ui/react'
import { AxiosInstance } from 'axios'
import { useState } from 'react'
import { ShowError, ShowSuccess, UserData } from '../types'

type UserActionsProps = {
  client: AxiosInstance
  user: UserData
  showError: ShowError
  showSuccess: ShowSuccess
  setUserData: (data: UserData) => void
}

const UserActions = ({client, user, showError, showSuccess, setUserData}: UserActionsProps) => {
  const [loading, setLoading] = useState<boolean>(false)

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
              setUserData({
                ...user,
                elections: {
                  ...user.elections,
                  [election.electionId]: {
                    ...election,
                    remainingAttempts: 5,
                  },
                },
              })
              showSuccess('SMS attempts reset successfully')
            }
            setLoading(false)
          })()
        }}>
        Reset 5 SMS limit
      </Button>
      <Button
        disabled={loading}
        isLoading={loading}
        w='full'
        onClick={() => {
          setLoading(true)
          ;(async () => {
            const [ election ] = Object.values(user.elections)
            if (!election) {
              showSuccess('User has no access to any election')
              return setLoading(false)
            }
            if (!election.consumed) {
              showSuccess('Status was already set to NOT consumed')
              return setLoading(false)
            }
            try {
              await client.get(`/setConsumed/${user.userID}/${election.electionId}/false`)
              setUserData({
                ...user,
                elections: {
                  ...user.elections,
                  [election.electionId]: {
                    ...election,
                    consumed: false,
                  },
                },
              })
              showSuccess('Consumed status set to NOT consumed successfully')
            } catch (e: any) {
              console.error(`error setting consumed to user ${user.userID}:`, e)
              showError('Sorry, couldn\'t do that', 'Check console for more details')
            }
            setLoading(false)
          })()
        }}>
        Set NOT consumed
      </Button>
    </HStack>
  )
}

export default UserActions

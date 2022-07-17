import { HamburgerIcon } from '@chakra-ui/icons'
import {
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Stack,
} from '@chakra-ui/react'
import { ATTEMPTS_MAX_DEFAULT } from '@constants'
import { useUser } from '@hooks/use-user'
import { Election } from '@localtypes'
import { useState } from 'react'
import { If, Then } from 'react-if'

const ElectionActions = ({election}: {election: Election}) => {
  const { addAttempt, resetAttempts, setConsumed } = useUser()
  const [ loading, setLoading ] = useState<boolean>(false)

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          aria-label='Actions'
          icon={<HamburgerIcon />}
        />
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxW='200px'>
          <PopoverArrow />
          <PopoverBody>
          <Stack alignItems='stretch' display='flex'>
            <If condition={election.remainingAttempts < ATTEMPTS_MAX_DEFAULT}>
              <Then>
                <Button
                  size='sm'
                  disabled={loading}
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true)
                    ;(async () => {
                      await addAttempt(election.electionId)
                    })()
                    setLoading(false)
                  }}>
                  Add an attempt
                </Button>
                <Button
                  size='sm'
                  disabled={loading}
                  isLoading={loading}
                  onClick={() => {
                    setLoading(true)
                    ;(async () => {
                      await resetAttempts(election.electionId)
                    })()
                    setLoading(false)
                  }}>
                  Reset 5 SMS limit
                </Button>
              </Then>
            </If>
            <Button
              size='sm'
              disabled={loading}
              colorScheme='orange'
              isLoading={loading}
              onClick={() => {
                setLoading(true)
                ;(async () => {
                  await setConsumed(election.electionId, !election.consumed)
                })()
                setLoading(false)
              }}>
              Set {!!election.consumed && 'NOT'} consumed
            </Button>
          </Stack>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  )
}

export default ElectionActions

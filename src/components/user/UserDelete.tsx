import { DeleteIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Heading,
  Stack,
  useDisclosure,
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { useRef } from 'react'

const UserDelete = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { remove } = useUser()
  const cancelRef = useRef<HTMLButtonElement>(null)

  return (
    <Stack>
      <Heading size='md'>Delete user</Heading>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Delete user
          </AlertDialogHeader>

          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              onClick={remove}
              ml={3}
              rightIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Button
        colorScheme='red'
        onClick={onOpen}
        rightIcon={<DeleteIcon />}
      >
        Delete user
      </Button>
    </Stack>
  )
}

export default UserDelete

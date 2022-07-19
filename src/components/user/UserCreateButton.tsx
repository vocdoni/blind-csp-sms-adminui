import {
  Button,
  ButtonGroup,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { useUserCreate } from '@hooks/use-user-create'
import { FiUserPlus } from 'react-icons/fi'
import UserCreate from './UserCreate'

const UserCreateButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { set } = useUser()
  const { create, loading, clear, data: { hash } } = useUserCreate()

  const onCreate = async () => {
    if (await create()) {
      set(hash)
      clear()
      onClose()
    }
  }

  return (
    <>
      <IconButton
        aria-label='Create user'
        colorScheme='green'
        variant='ghost'
        title='Create user'
        icon={<FiUserPlus />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!loading}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UserCreate create={onCreate} />
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <Button onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={onCreate}
                colorScheme='green'
                disabled={loading}
                isLoading={loading}
              >
                Save
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UserCreateButton

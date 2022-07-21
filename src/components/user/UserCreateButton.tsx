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
import { useUserCreate } from '@hooks/use-user-create'
import { FiUserPlus } from 'react-icons/fi'
import UserForm from './UserForm'

const UserCreateButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { create, loading, clear } = useUserCreate()

  const onCreate = async () => {
    if (await create()) {
      onClose()
    }
  }

  const open = () => {
    clear()
    onOpen()
  }

  return (
    <>
      <IconButton
        aria-label='Create user'
        colorScheme='green'
        variant='ghost'
        title='Create user'
        icon={<FiUserPlus />}
        onClick={open}
      />
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!loading}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create user</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UserForm method={onCreate} />
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

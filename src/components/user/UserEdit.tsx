import {
  Button,
  ButtonGroup,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react'
import { useUser } from '@hooks/use-user'
import { useUserCreate } from '@hooks/use-user-create'
import UserForm from './UserForm'

const UserEdit = () => {
  const { user, loading } = useUser()
  const { edit: { isOpen, onClose }, update } = useUserCreate()

  const onEdit = async () => {
    if (await update()) {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit user</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <UserForm
            method={onEdit}
            defaults={{
              hash: user.userID,
              phone: `+${user.phone.country_code}${user.phone.national_number}`,
              extra: user.extraData,
            }}
          />
        </ModalBody>
        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={onEdit}
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
  )
}

export default UserEdit

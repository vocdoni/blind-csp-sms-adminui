import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from '@chakra-ui/react'
import { UserAuthProps } from '@localtypes'
import UserAuth from './UserAuth'

const UserAuthButton = (props: UserAuthProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <Button onClick={onOpen} size='sm'>Auth</Button>
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Auth process</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <UserAuth {...props} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose} size='sm'>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UserAuthButton

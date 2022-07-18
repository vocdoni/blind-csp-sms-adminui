import { DeleteIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  IconButton,
  Input,
  Stack,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react'
import { useApi } from '@hooks/use-api'
import { useUser } from '@hooks/use-user'
import { FileReaderAsText, formatError } from '@utils'
import { ChangeEvent, useRef, useState } from 'react'
import { FiUpload } from 'react-icons/fi'

const ApiImport = () => {
  const cancelRef = useRef<HTMLButtonElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { token, base, restore } = useApi()
  const { getAll, resetAll } = useUser()
  const toast = useToast()
  const [ loading, setLoading ] = useState<boolean>(false)
  const [ contents, setContents ] = useState<{users: any[]}>({users: []})

  const onFileSelected = async ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || (target.files && !target.files.length)) return
    setLoading(true)
    try {
      const [ file ] = target.files
      const result = await FileReaderAsText(file)
      const json = JSON.parse(result)

      if (!(json.users && typeof json.users === 'object')) {
        throw new Error('File does not contain required "users" field')
      }

      setContents(json)
      onOpen()
    } catch (e) {
      toast({
        status: 'error',
        title: 'Selected file is not a valid db file',
        description: formatError(e).message,
      })
      console.warn('Selected file is not a valid db file', e)
    }
    setLoading(false)
  }

  const restoreDb = async () => {
    setLoading(true)
    if (await restore(contents)) {
      resetAll()
      setContents({users: []})
      getAll()
      onClose()
    }
    setLoading(false)
  }

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay />
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Import JSON backup
          </AlertDialogHeader>

          <AlertDialogBody>
            <Stack spacing={4}>
              <Text>You're about to import a backup containing {Object.keys(contents?.users).length} users and destroy the old DB data.</Text>
              <Text>Are you sure? You can't undo this action afterwards.</Text>
            </Stack>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme='red'
              ml={3}
              onClick={restoreDb}
              disabled={loading}
              isLoading={loading}
              rightIcon={<DeleteIcon />}
            >
              Yeah, restore it
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <IconButton
        aria-label='Restore DB'
        title='Restore DB'
        icon={<FiUpload />}
        variant='ghost'
        colorScheme='yellow'
        isLoading={loading}
        disabled={loading || !token.valid || !base.valid}
        onClick={() => {
          if (!uploadRef.current) return

          uploadRef.current.click()
        }}
        alignSelf='end'
        size='sm'
      />
      <Input
        accept='.json,application/json'
        type='file'
        display='none'
        onChange={onFileSelected}
        ref={uploadRef}
      />
    </>
  )
}

export default ApiImport

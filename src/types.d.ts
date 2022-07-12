import { AxiosInstance } from 'axios'

type ShowError = (text: string, description?: string) => void
type FakePinProps = {
  showError: ShowError,
  client: AxiosInstance | undefined,
}
type CreateUserProps = {
  showError: ShowError,
  client: AxiosInstance | undefined,
}

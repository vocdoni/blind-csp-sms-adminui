import { AxiosResponse } from 'axios'
import { KeyboardEvent } from 'react'

export const enterCallback = (e: KeyboardEvent<HTMLInputElement>, callback: () => void) => {
  if (e.key !== 'Enter') {
    return
  }

  callback()
}

export const hidePhoneNumber = (phone: string) =>
  phone.substring(0, 2) + '•••' + phone.substring(phone.length - 3, phone.length)


export const formatError = (e: any) => {
  if (typeof e === 'object' && e.hasOwnProperty('response')) {
    const { response: { data } } = e

    if (
      typeof data === 'object' &&
      data.hasOwnProperty('error') &&
      typeof data.error === 'string'
    ) {
      return new Error(data.error)
    }
  }

  if (typeof e === 'object' && e.hasOwnProperty('message')) {
    return new Error(e.message)
  }

  if (typeof e === 'string') {
    return new Error(e)
  }

  console.warn('unkown error to be formated:', e)
  return new Error('Unknown error to be formated')
}

export const processApiResponse = (response: AxiosResponse) => {
  if (!response.data.ok) {
    throw new Error('API did not send ok field')
  }
  if (response.data.ok !== 'true') {
    throw new Error('API said KO')
  }

  return response.data
}

/**
 * Handy Promise for reading File with FileReader
 *
 * @param File Which file to read the contents from.
 */
 export const FileReaderAsText = (file: File) : Promise<string>=> new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (e: ProgressEvent<FileReader>) => {
    if (!e.target) return reject()

    resolve(e.target.result as string)
  }
  reader.onerror = reject

  reader.readAsText(file)
})

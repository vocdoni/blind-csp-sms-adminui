import { KeyboardEvent } from 'react'

export const enterCallback = (e: KeyboardEvent<HTMLInputElement>, callback: () => void) => {
  if (e.key !== 'Enter') {
    return
  }

  callback()
}

export const hidePhoneNumber = (phone: string) =>
  phone.substring(0, 1) + '*****' + phone.substring(phone.length - 2, phone.length)


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

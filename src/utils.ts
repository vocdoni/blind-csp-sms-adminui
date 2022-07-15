import { keccak256 } from '@ethersproject/keccak256'
import { KeyboardEvent } from 'react'
import { KECCAK_SALT } from './constants'

const Buffer = require('buffer/').Buffer

export const generateHashFromValues = (code: string, pin: string) =>
  keccak256(Buffer.from(`${code}${pin}${KECCAK_SALT}`)).substr(2)


export const enterCallback = (e: KeyboardEvent<HTMLInputElement>, callback: () => void) => {
  if (e.key !== 'Enter') {
    return
  }

  callback()
}

export const hidePhoneNumber = (phone: string) =>
  phone.substring(0, 1) + '*****' + phone.substring(phone.length - 2, phone.length)

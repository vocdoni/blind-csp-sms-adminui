import { keccak256 } from '@ethersproject/keccak256'
import { KECCAK_SALT } from './constants'

const Buffer = require('buffer/').Buffer

export const generateHashFromValues = (code: string, pin: string) =>
  keccak256(Buffer.from(`${code}${pin}${KECCAK_SALT}`)).substr(2)

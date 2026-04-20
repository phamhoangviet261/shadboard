import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto"
import { promisify } from "node:util"

const scrypt = promisify(scryptCallback)
const SALT_SIZE = 16
const KEY_SIZE = 64

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_SIZE).toString("hex")
  const derivedKey = (await scrypt(password, salt, KEY_SIZE)) as Buffer

  return `${salt}:${derivedKey.toString("hex")}`
}

export async function verifyPassword(password: string, hashedPassword: string) {
  const [salt, storedHash] = hashedPassword.split(":")

  if (!salt || !storedHash) return false

  const derivedKey = (await scrypt(password, salt, KEY_SIZE)) as Buffer
  const storedKey = Buffer.from(storedHash, "hex")

  if (storedKey.length !== derivedKey.length) return false

  return timingSafeEqual(storedKey, derivedKey)
}

import jwt from 'jsonwebtoken'

export interface Token {
  id: number
  username: string
}

export async function getToken(event: any): Promise<Token | null> {
  try {
    const config = useRuntimeConfig()
    const token = getHeader(event, 'Authorization')?.replace('Bearer ', '')

    if (!token) {
      return null
    }

    const decoded = jwt.verify(token, config.authSecret) as Token
    return decoded
  } catch (error) {
    return null
  }
}
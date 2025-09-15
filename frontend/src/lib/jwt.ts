import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'solar-sense-secret-key-2024'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: string
  householdId?: string
  iat?: number
  exp?: number
}

export const generateJWT = (payload: Omit<JWTPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: 'solar-sense',
    audience: 'solar-sense-users'
  } as jwt.SignOptions)
}

export const verifyJWT = (token: string): JWTPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'solar-sense',
      audience: 'solar-sense-users'
    } as jwt.VerifyOptions) as JWTPayload
    
    return decoded
  } catch (_error) {
    throw new Error('Invalid or expired token')
  }
}

export const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.decode(token) as JWTPayload
    return decoded
  } catch (_error) {
    return null
  }
}

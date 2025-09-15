// Google OAuth Configuration - SSR safe
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || `${window.location.origin}/auth/google/callback`
  }
  return process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/google/callback'
}

export const GOOGLE_OAUTH_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'your-google-client-id',
  get redirectUri() {
    return getRedirectUri()
  },
  scope: 'openid email profile',
  responseType: 'code',
  accessType: 'offline',
  prompt: 'consent'
}

// Google OAuth URLs
export const GOOGLE_OAUTH_URLS = {
  auth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://oauth2.googleapis.com/token',
  userInfo: 'https://www.googleapis.com/oauth2/v2/userinfo'
}

// Generate Google OAuth URL
export const generateGoogleAuthUrl = (): string => {
  // Ensure we're on the client side
  if (typeof window === 'undefined') {
    throw new Error('generateGoogleAuthUrl can only be called on the client side')
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_OAUTH_CONFIG.clientId,
    redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    scope: GOOGLE_OAUTH_CONFIG.scope,
    response_type: GOOGLE_OAUTH_CONFIG.responseType,
    access_type: GOOGLE_OAUTH_CONFIG.accessType,
    prompt: GOOGLE_OAUTH_CONFIG.prompt,
    state: Math.random().toString(36).substring(7) // CSRF protection
  })

  return `${GOOGLE_OAUTH_URLS.auth}?${params.toString()}`
}

// Exchange authorization code for access token
export const exchangeCodeForToken = async (code: string): Promise<{
  access_token: string
  id_token: string
  refresh_token?: string
}> => {
  const response = await fetch(GOOGLE_OAUTH_URLS.token, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: GOOGLE_OAUTH_CONFIG.clientId,
      client_secret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || '',
      code,
      grant_type: 'authorization_code',
      redirect_uri: GOOGLE_OAUTH_CONFIG.redirectUri,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to exchange code for token')
  }

  return response.json()
}

// Get user info from Google
export const getGoogleUserInfo = async (accessToken: string): Promise<{
  id: string
  email: string
  name: string
  picture: string
  verified_email: boolean
}> => {
  const response = await fetch(GOOGLE_OAUTH_URLS.userInfo, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get user info from Google')
  }

  return response.json()
}

import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/jwt'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({
        success: false,
        message: 'No token provided'
      }, { status: 401 })
    }

    const token = authHeader.substring(7)
    
    // Verify JWT token
    try {
      const payload = verifyJWT(token)
      
      return NextResponse.json({
        success: true,
        user: {
          id: payload.userId,
          email: payload.email,
          name: payload.name,
          role: payload.role,
          householdId: payload.householdId
        }
      })
    } catch (_jwtError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid or expired token'
      }, { status: 401 })
    }

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
}

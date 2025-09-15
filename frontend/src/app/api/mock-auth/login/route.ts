import { NextRequest, NextResponse } from 'next/server'
import { generateJWT } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Mock authentication logic with proper JWT
    if (email === 'admin@solarsense.com' && password === 'admin123') {
      const user = {
        id: '1',
        email: 'admin@solarsense.com',
        name: 'Admin User',
        role: 'admin',
        householdId: 'household-1'
      }

      const token = generateJWT({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        householdId: user.householdId
      })

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user
      })
    }

    if (email === 'user@test.com' && password === 'password123') {
      const user = {
        id: '2',
        email: 'user@test.com',
        name: 'Test User',
        role: 'resident',
        householdId: 'household-2'
      }

      const token = generateJWT({
        userId: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        householdId: user.householdId
      })

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        token,
        user
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid email or password'
    }, { status: 401 })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
}

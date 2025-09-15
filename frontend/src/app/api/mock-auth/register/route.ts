import { NextRequest, NextResponse } from 'next/server'
import { generateJWT } from '@/lib/jwt'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json()

    // Mock registration logic with proper JWT
    if (email && password && name) {
      const user = {
        id: Date.now().toString(),
        email: email,
        name: name,
        role: role || 'resident',
        householdId: 'household-' + Date.now()
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
        message: 'Registration successful',
        token,
        user
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Missing required fields'
    }, { status: 400 })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 })
  }
}

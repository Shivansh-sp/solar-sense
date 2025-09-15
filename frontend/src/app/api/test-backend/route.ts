import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const backendUrl = 'https://solar-sense-backend.onrender.com'
    
    // Test basic connectivity
    const healthResponse = await fetch(`${backendUrl}/api/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const healthData = await healthResponse.json()

    return NextResponse.json({
      success: true,
      backendUrl,
      status: healthResponse.status,
      data: healthData,
      message: 'Backend connection successful'
    })

  } catch (error) {
    console.error('Backend test error:', error)
    
    return NextResponse.json({
      success: false,
      backendUrl: 'https://solar-sense-backend.onrender.com',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Backend connection failed'
    }, { status: 500 })
  }
}

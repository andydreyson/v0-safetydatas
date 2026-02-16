import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { rateLimit, getRateLimitIdentifier } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    // Rate limiting: 3 signups per hour per IP
    const identifier = getRateLimitIdentifier(request)

    if (!rateLimit(identifier, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { name, email, password, company } = await request.json()

    // Sanitize inputs
    const sanitizedData = {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      password: password, // Don't trim passwords (whitespace might be intentional)
      company: company?.trim(),
    }

    // Validate required fields
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate input lengths
    if (sanitizedData.name.length > 100) {
      return NextResponse.json(
        { error: 'Name is too long (max 100 characters)' },
        { status: 400 }
      )
    }

    if (sanitizedData.email.length > 255) {
      return NextResponse.json(
        { error: 'Email is too long (max 255 characters)' },
        { status: 400 }
      )
    }

    if (sanitizedData.company && sanitizedData.company.length > 200) {
      return NextResponse.json(
        { error: 'Company name is too long (max 200 characters)' },
        { status: 400 }
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(sanitizedData.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Password strength validation
    if (sanitizedData.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Password complexity validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/
    if (!passwordRegex.test(sanitizedData.password)) {
      return NextResponse.json(
        { error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: sanitizedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(sanitizedData.password, 12)

    // Create user with sanitized data
    const user = await prisma.user.create({
      data: {
        name: sanitizedData.name,
        email: sanitizedData.email,
        password: hashedPassword,
        company: sanitizedData.company || null,
      }
    })

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      },
      { status: 201 }
    )

  } catch (error: any) {
    console.error('Signup error:', error)

    // Generic error message in production
    const message = process.env.NODE_ENV === 'production'
      ? 'An error occurred during signup. Please try again.'
      : error?.message || 'Failed to create user'

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
}

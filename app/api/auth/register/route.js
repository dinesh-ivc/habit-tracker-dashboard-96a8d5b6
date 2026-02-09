/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 */

import { NextResponse } from 'next/server';
import { validateEmail, validatePassword } from '@/lib/validation';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/server';
import { createToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const supabase = createAdminClient();
    const data = await request.json();
    const { name, email, password, role } = data;

    // Validation
    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: existingError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name,
        email,
        password_hash: hashedPassword,
        role
      }])
      .select()
      .single();

    if (insertError) {
      throw new Error(insertError.message);
    }

    // Create JWT token
    const token = createToken({ id: newUser.id, email: newUser.email, role: newUser.role });

    return NextResponse.json(
      { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Registration failed' },
      { status: 500 }
    );
  }
}
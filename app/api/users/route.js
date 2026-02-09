/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get current user info
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Current user information
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request) {
  try {
    const supabase = createAdminClient();
    
    // Extract and verify token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
    }

    // Fetch user data
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('id', decoded.id)
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user info:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch user info' }, { status: 500 });
  }
}
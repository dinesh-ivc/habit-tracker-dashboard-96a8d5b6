/**
 * @swagger
 * /api/habits:
 *   get:
 *     summary: Get all user habits
 *     tags: [Habits]
 *     responses:
 *       200:
 *         description: List of habits
 *   post:
 *     summary: Create a new habit
 *     tags: [Habits]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               target_frequency:
 *                 type: integer
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

    // Fetch habits for the user
    const { data, error } = await supabase
      .from('habits')
      .select(`
        *,
        daily_logs (
          *
        )
      `)
      .eq('user_id', decoded.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const supabase = createAdminClient();
    const data = await request.json();
    const { name, description, target_frequency } = data;
    
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

    // Validation
    if (!name || !target_frequency) {
      return NextResponse.json(
        { success: false, message: 'Name and target frequency are required' },
        { status: 400 }
      );
    }

    // Create habit
    const { data: newHabit, error } = await supabase
      .from('habits')
      .insert([{ 
        name, 
        description, 
        target_frequency,
        user_id: decoded.id 
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: newHabit });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ success: false, message: 'Failed to create habit' }, { status: 500 });
  }
}
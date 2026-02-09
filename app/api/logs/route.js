/**
 * @swagger
 * /api/logs:
 *   post:
 *     summary: Create or update a daily log
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               habit_id:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               completed:
 *                 type: boolean
 *   get:
 *     summary: Get daily logs for the current day
 *     tags: [Logs]
 *     responses:
 *       200:
 *         description: Daily logs for today
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

export async function POST(request) {
  try {
    const supabase = createAdminClient();
    const data = await request.json();
    const { habit_id, date, completed } = data;
    
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

    // Verify habit belongs to user
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('user_id')
      .eq('id', habit_id)
      .single();

    if (habitError || !habit || habit.user_id !== decoded.id) {
      return NextResponse.json({ success: false, message: 'Habit not found or unauthorized' }, { status: 404 });
    }

    // Try to update existing record
    const { error: updateError } = await supabase
      .from('daily_logs')
      .update({ completed, created_at: new Date().toISOString() })
      .eq('habit_id', habit_id)
      .eq('date', date);

    // If no row was affected, insert new record
    if (updateError) {
      return NextResponse.json({ success: false, message: 'Failed to update log' }, { status: 500 });
    } else {
      // Check if anything was updated
      const { count } = await supabase
        .from('daily_logs')
        .select('*', { count: 'exact' })
        .eq('habit_id', habit_id)
        .eq('date', date);
      
      if (count === 0) {
        // Insert if no previous record
        const { data: newLog, error: insertError } = await supabase
          .from('daily_logs')
          .insert([{ 
            habit_id, 
            user_id: decoded.id, 
            date, 
            completed 
          }])
          .select()
          .single();

        if (insertError) throw insertError;

        return NextResponse.json({ success: true, data: newLog });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating/updating log:', error);
    return NextResponse.json({ success: false, message: 'Failed to create/update log' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const supabase = createAdminClient();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
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

    // Get all habit logs for today for this user
    const { data, error } = await supabase
      .from('daily_logs')
      .select(`
        *,
        habit:habits(name)
      `)
      .eq('user_id', decoded.id)
      .eq('date', today)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching today\'s logs:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch logs' }, { status: 500 });
  }
}
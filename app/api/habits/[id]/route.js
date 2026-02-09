/**
 * @swagger
 * /api/habits/{id}:
 *   put:
 *     summary: Update a habit
 *     tags: [Habits]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
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
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *   delete:
 *     summary: Delete a habit
 *     tags: [Habits]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 */

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyToken } from '@/lib/jwt';

export async function PUT(request, { params }) {
  try {
    const supabase = createAdminClient();
    const habitId = params.id;
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

    // Verify habit belongs to user
    const { data: existingHabit, error: findError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', decoded.id)
      .single();

    if (findError || !existingHabit) {
      return NextResponse.json({ success: false, message: 'Habit not found' }, { status: 404 });
    }

    // Update habit
    const { data: updatedHabit, error } = await supabase
      .from('habits')
      .update({ 
        name, 
        description, 
        target_frequency,
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId)
      .eq('user_id', decoded.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: updatedHabit });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ success: false, message: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const supabase = createAdminClient();
    const habitId = params.id;
    
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
    const { data: existingHabit, error: findError } = await supabase
      .from('habits')
      .select('*')
      .eq('id', habitId)
      .eq('user_id', decoded.id)
      .single();

    if (findError || !existingHabit) {
      return NextResponse.json({ success: false, message: 'Habit not found' }, { status: 404 });
    }

    // Delete habit and its related logs
    const { error: logsDeleteError } = await supabase
      .from('daily_logs')
      .delete()
      .eq('habit_id', habitId);

    if (logsDeleteError) throw logsDeleteError;

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', decoded.id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ success: false, message: 'Failed to delete habit' }, { status: 500 });
  }
}
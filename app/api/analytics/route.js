/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get user analytics
 *     tags: [Analytics]
 *     responses:
 *       200:
 *         description: Analytics data
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

    // Calculate current streak (consecutive completed days)
    const { data: allLogs, error: logsError } = await supabase
      .from('daily_logs')
      .select('date, completed')
      .eq('user_id', decoded.id)
      .gt('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('date', { ascending: false });

    if (logsError) throw logsError;

    let currentStreak = 0;
    const logDatesMap = {};
    allLogs.forEach(log => {
      if (log.completed) {
        logDatesMap[log.date] = true;
      }
    });
    
    // Simple current streak calculation - last consecutive days with completed logs
    let currentDate = new Date();
    while (currentDate >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (logDatesMap[dateStr]) {
        currentStreak++;
      } else {
        break;
      }
      currentDate.setDate(currentDate.getDate() - 1);
    }

    // Calculate completion rate
    const totalLogs = allLogs.length;
    const completedLogs = allLogs.filter(log => log.completed).length;
    const completionRate = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        streak: currentStreak,
        completionRate,
      }
    });
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return NextResponse.json({ success: false, message: 'Failed to calculate analytics' }, { status: 500 });
  }
}
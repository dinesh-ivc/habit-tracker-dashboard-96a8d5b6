/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Logout successful
 */

import { NextResponse } from 'next/server';

export async function POST() {
  // Clear session/token if stored server-side
  // This doesn't actually clear JWT on client unless client handles it
  
  // Typically handled client side by clearing local storage/cookies
  return NextResponse.json({
    success: true,
    message: 'Logged out'
  });
}
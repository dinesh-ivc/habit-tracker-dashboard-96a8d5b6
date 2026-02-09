'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import HabitForm from './HabitForm';
import HabitCard from './HabitCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';

export default function DashboardPage({ habits, analytics }) {
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshDashobard = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Habit Dashboard</h1>
        <Dialog open={showAddHabit} onOpenChange={setShowAddHabit}>
          <DialogTrigger asChild>
            <Button>+ Add Habit</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <HabitForm onSuccess={() => {
              setShowAddHabit(false);
              refreshDashobard();
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Habits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.streak || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.completionRate ? `${Math.round(analytics.completionRate)}%` : '0%'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {habits.map((habit) => (
          <HabitCard key={habit.id} habit={habit} onRefresh={refreshDashobard} />
        ))}
      </div>
    </div>
  );
}
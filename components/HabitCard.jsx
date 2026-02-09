'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Trash2, Edit3, CheckCircle } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { createClient } from '@/lib/supabase/client';

export default function HabitCard({ habit, onRefresh }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [todayStatus, setTodayStatus] = useState(getTodaysStatus());

  function getTodaysStatus() {
    if (!habit.daily_logs) return false;
    const today = new Date().toISOString().split('T')[0];
    return habit.daily_logs.some(log => log.date === today && log.completed);
  }

  const handleCheckIn = async () => {
    try {
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          habit_id: habit.id,
          date: new Date().toISOString().split('T')[0],
          completed: !todayStatus
        }),
      });

      if (response.ok) {
        setTodayStatus(!todayStatus);
        onRefresh();
      }
    } catch (error) {
      console.error('Error checking in:', error);
    }
  };

  const handleEdit = (updatedHabit) => {
    setIsEditing(false);
    onRefresh();
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/habits/${habit.id}`, { method: 'DELETE' });
      if (response.ok) {
        setIsDeleting(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const streak = habit.daily_logs?.reduce((acc, log) => {
    if (log.completed) acc++; // This is a simplified calculation
    return acc;
  }, 0) || 0;

  const completionRate = habit.daily_logs?.length > 0 
    ? Math.round((habit.daily_logs.filter(log => log.completed).length / habit.daily_logs.length) * 100)
    : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{habit.name}</CardTitle>
          <div className="space-x-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Edit3 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <HabitForm onSuccess={handleEdit} initialData={habit} />
              </DialogContent>
            </Dialog>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <div className="space-y-4">
                  <h3 className="font-semibold">Delete Habit</h3>
                  <p>Are you sure you want to delete "{habit.name}"?</p>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsDeleting(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleDelete}>Delete</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        {habit.description && (
          <p className="text-sm text-gray-600 mt-2">{habit.description}</p>
        )}
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center justify-between">
          <Badge variant={todayStatus ? "default" : "secondary"}>
            {todayStatus ? "Completed" : "Incomplete"}
          </Badge>
          <div className="text-sm font-medium">{streak} day streak</div>
        </div>

        <ProgressBar 
          completed={completionRate} 
          total={100} 
          label={`${completionRate}% completed`}
        />

        <div className="text-xs text-gray-500">
          Target: {habit.target_frequency}x per day
        </div>
      </CardContent>

      <CardFooter>
        <Button 
          className="w-full" 
          variant={todayStatus ? "secondary" : "default"}
          onClick={handleCheckIn}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {todayStatus ? "Mark Incomplete" : "Mark Complete"}
        </Button>
      </CardFooter>
    </Card>
  );
}
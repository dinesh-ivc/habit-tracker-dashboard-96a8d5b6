'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import DashboardPage from '@/components/DashboardPage';
import { createClient } from '@/lib/supabase/client';

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const supabase = createClient();

      // Fetch habits
      const { data: habitsData, error: habitsError } = await supabase
        .from('habits')
        .select(`
          *,
          daily_logs (
            *
          )
        `)
        .order('created_at', { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch analytics
      const response = await fetch('/api/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const analyticsData = await response.json();

      setHabits(habitsData);
      setAnalytics(analyticsData.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return <DashboardPage habits={habits} analytics={analytics} />;
}
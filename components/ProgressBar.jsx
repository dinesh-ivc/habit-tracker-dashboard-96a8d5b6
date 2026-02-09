'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function ProgressBar({ completed, total, label }) {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
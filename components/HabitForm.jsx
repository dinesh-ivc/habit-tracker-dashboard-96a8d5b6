'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

export default function HabitForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    target_frequency: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'target_frequency' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error creating habit:', errorData);
        alert('Failed to create habit: ' + errorData.message);
      }
    } catch (error) {
      console.error('Error creating habit:', error);
      alert('Failed to create habit');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Habit Name *</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="e.g., Drink water daily"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description of your habit..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="target_frequency">Target Frequency</Label>
        <Select 
          name="target_frequency" 
          value={formData.target_frequency} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, target_frequency: parseInt(value) }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Once a Day</SelectItem>
            <SelectItem value="2">Twice a Day</SelectItem>
            <SelectItem value="3">Three times a Day</SelectItem>
            <SelectItem value="7">Weekly Goal</SelectItem>
          </SelectContent>
        </Select>

        <span className="text-xs text-gray-500">
          How often do you want to practice this habit?
        </span>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="ml-auto">Create Habit</Button>
      </div>
    </form>
  );
}
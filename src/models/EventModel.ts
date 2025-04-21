
import { cva } from 'class-variance-authority';

export type PriorityLevel = 'highest' | 'high' | 'medium' | 'low' | 'lowest';

export interface EventModel {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
  color: 'red' | 'purple' | 'blue' | 'green' | 'yellow';
  allDay?: boolean;
  completed?: boolean;
  rescheduled?: boolean;
  priority: PriorityLevel;
}

// Detailed explanation of priority levels and their colors
export const priorityDetails = {
  highest: {
    color: 'red',
    description: 'Critically important - Requires immediate attention',
    impact: 'High urgency, top priority tasks'
  },
  high: {
    color: 'purple',
    description: 'Very important - Significant impact',
    impact: 'High-priority tasks that need prompt action'
  },
  medium: {
    color: 'blue',
    description: 'Moderately important - Standard priority',
    impact: 'Regular tasks with balanced importance'
  },
  low: {
    color: 'green',
    description: 'Less critical - Can be done when convenient',
    impact: 'Tasks that are important but not urgent'
  },
  lowest: {
    color: 'yellow',
    description: 'Minimal importance - Optional tasks',
    impact: 'Background or optional tasks'
  }
};

// Map priority levels to colors
export const priorityColors: Record<PriorityLevel, EventModel['color']> = {
  highest: 'red',
  high: 'purple',
  medium: 'blue',
  low: 'green',
  lowest: 'yellow'
};

// Priority levels array for iteration
export const priorityLevels: PriorityLevel[] = ['highest', 'high', 'medium', 'low', 'lowest'];

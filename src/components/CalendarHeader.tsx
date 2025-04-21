
import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  LayoutGrid,
  Clock
} from 'lucide-react';
import { getMonthName } from '../utils/calendarUtils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CalendarHeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onAddEvent: () => void;
  onViewChange: (view: 'month' | 'day') => void;
  onTodayClick: () => void;
  currentView: 'month' | 'day';
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onAddEvent,
  onViewChange,
  onTodayClick,
  currentView
}) => {
  const month = getMonthName(currentDate.getMonth());
  const year = currentDate.getFullYear();

  return (
    <div className="border-b border-border p-4 flex flex-col sm:flex-row justify-between gap-4">
      <h2 className="text-2xl font-semibold">
        {month} {year}
      </h2>
      
      <div className="flex items-center gap-2 flex-wrap justify-end">
        <Button variant="outline" onClick={onTodayClick} size="sm">
          Today
        </Button>
        
        <div className="flex items-center rounded-md border border-input">
          <Button variant="ghost" size="icon" className="rounded-none rounded-l-md" onClick={onPrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-none rounded-r-md" onClick={onNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {currentView === 'month' ? (
                <><LayoutGrid className="mr-2 h-4 w-4" /> Month</>
              ) : (
                <><Clock className="mr-2 h-4 w-4" /> Day</>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewChange('month')}>
              <LayoutGrid className="mr-2 h-4 w-4" /> Month
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onViewChange('day')}>
              <Clock className="mr-2 h-4 w-4" /> Day
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button onClick={onAddEvent} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Add Event
        </Button>
      </div>
    </div>
  );
};

export default CalendarHeader;

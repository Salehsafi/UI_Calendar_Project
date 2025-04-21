
import React from 'react';
import { daysOfWeek, getMonthData, isSameDate } from '../utils/calendarUtils';
import { useEvents } from '../contexts/EventContext';
import { EventModel } from '../models/EventModel';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MonthViewProps {
  currentDate: Date;
  onDayClick: (date: Date) => void;
  onEventClick: (event: EventModel) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  onDayClick,
  onEventClick
}) => {
  const { getEventsForDate } = useEvents();
  const monthData = getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  const today = new Date();

  return (
    <div className="overflow-hidden">
      <div className="grid grid-cols-7 mb-1">
        {daysOfWeek.map((day, index) => (
          <div key={index} className="text-center py-2 font-medium text-sm text-foreground/80">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-px bg-border rounded overflow-hidden">
        {monthData.map((dateObj, index) => {
          const events = getEventsForDate(dateObj.date);
          const isToday = isSameDate(dateObj.date, today);
          
          return (
            <div 
              key={index} 
              className={cn(
                "min-h-[100px] bg-card p-1 transition-colors hover:bg-muted/50 cursor-pointer",
                !dateObj.currentMonth && "text-muted-foreground bg-muted/30",
                isToday && "bg-primary/10 border border-primary"
              )}
              onClick={() => onDayClick(dateObj.date)}
            >
              <div className={cn(
                "font-medium text-sm mb-1 p-1 rounded-full w-7 h-7 flex items-center justify-center",
                isToday && "bg-primary text-primary-foreground"
              )}>
                {dateObj.day}
              </div>
              
              <div>
                {events.slice(0, 3).map(event => (
                  <div 
                    key={event.id} 
                    className={cn(
                      "text-xs font-medium truncate py-1 px-2 mb-1 rounded flex items-center justify-between",
                      `event-${event.color}`,
                      event.rescheduled && "border-l-2 border-amber-500"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <span className="truncate">{event.title}</span>
                    {event.rescheduled && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <ArrowRight className="ml-1 h-3 w-3 flex-shrink-0 text-amber-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rescheduled from previous day</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                ))}
                {events.length > 3 && (
                  <div className="text-xs text-muted-foreground pl-2">
                    +{events.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;

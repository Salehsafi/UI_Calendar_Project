
import React from 'react';
import { formatDate, formatTime } from '../utils/calendarUtils';
import { useEvents } from '../contexts/EventContext';
import { EventModel } from '../models/EventModel';
import { CalendarClock, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DayViewProps {
  currentDate: Date;
  onEventClick: (event: EventModel) => void;
}

const DayView: React.FC<DayViewProps> = ({ currentDate, onEventClick }) => {
  const { getEventsForDate } = useEvents();
  const events = getEventsForDate(currentDate);
  
  // Generate time slots from 8 AM to 8 PM
  const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8);

  return (
    <div className="flex flex-col">
      <h3 className="text-xl font-medium mb-4">{formatDate(currentDate)}</h3>
      
      {events.filter(event => event.allDay).length > 0 && (
        <div className="mb-6 bg-muted/20 p-3 rounded-lg">
          <div className="flex items-center gap-2 mb-2 text-muted-foreground">
            <CalendarClock className="h-4 w-4" />
            <span className="text-sm font-medium">All Day</span>
          </div>
          <div className="space-y-2">
            {events.filter(event => event.allDay).map(event => (
              <div
                key={event.id}
                className={cn(
                  "p-2 rounded-md cursor-pointer",
                  `event-${event.color}`,
                  event.rescheduled && "border-l-4 border-amber-500"
                )}
                onClick={() => onEventClick(event)}
              >
                <div className="font-medium flex items-center">
                  {event.title}
                  {event.rescheduled && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <ArrowRight className="ml-2 h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rescheduled from previous day</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                {event.location && (
                  <div className="text-xs opacity-75">{event.location}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex flex-col space-y-1 h-[600px] overflow-auto pr-2">
        {timeSlots.map(hour => {
          const timeEvents = events.filter(event => {
            if (event.allDay) return false;
            const eventHour = event.start.getHours();
            return eventHour === hour;
          });
          
          return (
            <div key={hour} className="flex border-t border-border py-2">
              <div className="w-16 text-right pr-4 text-sm text-muted-foreground pt-2">
                {hour % 12 === 0 ? 12 : hour % 12}:00 {hour >= 12 ? 'PM' : 'AM'}
              </div>
              <div className="flex-1">
                {timeEvents.map(event => (
                  <div
                    key={event.id}
                    className={cn(
                      "mb-2 p-2 rounded-md cursor-pointer",
                      `event-${event.color}`,
                      event.rescheduled && "border-l-4 border-amber-500"
                    )}
                    onClick={() => onEventClick(event)}
                  >
                    <div className="font-medium flex items-center">
                      {event.title}
                      {event.rescheduled && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <ArrowRight className="ml-2 h-4 w-4 text-amber-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rescheduled from previous day</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                    <div className="text-xs opacity-75">
                      {formatTime(event.start)} - {formatTime(event.end)}
                    </div>
                    {event.location && (
                      <div className="text-xs opacity-75 mt-1">{event.location}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;

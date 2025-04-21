import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from 'react';
import { EventModel, PriorityLevel } from '../models/EventModel';
import { isSameDate } from '../utils/calendarUtils';
import { toast } from 'sonner';

interface EventContextType {
  events: EventModel[];
  addEvent: (event: EventModel) => void;
  getEventsForDate: (date: Date) => EventModel[];
  getEvent: (id: string) => EventModel | undefined;
  deleteEvent: (id: string) => void;
  updateEvent: (event: EventModel) => void;
  moveOverdueTasks: () => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

// Demo events
const initialEvents: EventModel[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(new Date().setHours(10, 0, 0, 0)),
    end: new Date(new Date().setHours(11, 0, 0, 0)),
    description: 'Weekly team sync-up',
    location: 'Conference Room A',
    color: 'blue',
    completed: false,
    priority: 'medium'
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date(new Date().setDate(new Date().getDate() + 2)),
    end: new Date(new Date().setDate(new Date().getDate() + 2)),
    description: 'Annual checkup',
    location: 'Medical Center',
    color: 'green',
    allDay: true,
    completed: false,
    priority: 'high'
  },
  {
    id: '3',
    title: 'Birthday Party',
    start: new Date(new Date().setDate(new Date().getDate() - 2)),
    end: new Date(new Date().setDate(new Date().getDate() - 2)),
    description: "John's birthday celebration",
    location: 'Cafe Central',
    color: 'purple',
    completed: true,
    priority: 'low'
  }
];

// Get stored events from localStorage or use initialEvents
const getStoredEvents = (): EventModel[] => {
  try {
    const storedEvents = localStorage.getItem('calendar-events');
    if (storedEvents) {
      return JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      }));
    }
  } catch (error) {
    console.error('Error loading stored events:', error);
  }
  return initialEvents;
};

export const EventProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventModel[]>(getStoredEvents());

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  // Check for overdue tasks when the component mounts
  useEffect(() => {
    moveOverdueTasks();
    // Set up a daily check at midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    tomorrow.setHours(0, 0, 1, 0); // Just after midnight
    
    const timeUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const midnightTimeout = setTimeout(() => {
      moveOverdueTasks();
      
      // Set up daily interval after the first timeout
      const dailyInterval = setInterval(() => {
        moveOverdueTasks();
      }, 24 * 60 * 60 * 1000); // 24 hours
      
      return () => clearInterval(dailyInterval);
    }, timeUntilMidnight);
    
    return () => clearTimeout(midnightTimeout);
  }, []);

  const addEvent = (event: EventModel) => {
    setEvents([...events, event]);
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDate(event.start, date));
  };

  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };

  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
  };

  const updateEvent = (updatedEvent: EventModel) => {
    setEvents(events.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const moveOverdueTasks = useCallback(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const updatedEvents = events.map(event => {
      // Check if the event is in the past and not completed
      if (event.start < today && event.completed !== true) {
        // Set to current day
        const newStart = new Date();
        
        // Preserve the original time
        newStart.setHours(
          event.start.getHours(),
          event.start.getMinutes(),
          event.start.getSeconds()
        );
        
        // Update end time by maintaining the same duration
        const duration = event.end.getTime() - event.start.getTime();
        const newEnd = new Date(newStart.getTime() + duration);
        
        return {
          ...event,
          start: newStart,
          end: newEnd,
          rescheduled: true // Add a flag to indicate it was rescheduled
        };
      }
      return event;
    });
    
    // Only update if there were changes
    if (JSON.stringify(updatedEvents) !== JSON.stringify(events)) {
      setEvents(updatedEvents);
      toast.info("Incomplete tasks have been moved to today");
    }
  }, [events]);

  return (
    <EventContext.Provider value={{ 
      events, 
      addEvent, 
      getEventsForDate, 
      getEvent, 
      deleteEvent,
      updateEvent,
      moveOverdueTasks
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = (): EventContextType => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

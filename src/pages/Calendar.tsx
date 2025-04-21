
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { EventProvider, useEvents } from '../contexts/EventContext';
import CalendarHeader from '../components/CalendarHeader';
import MonthView from '../components/MonthView';
import DayView from '../components/DayView';
import EventModal from '../components/EventModal';
import EventDetailModal from '../components/EventDetailModal';
import { EventModel } from '../models/EventModel';
import { Card } from '@/components/ui/card';

const CalendarContent = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [showEventDetailModal, setShowEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventModel | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const { addEvent, updateEvent, deleteEvent, moveOverdueTasks } = useEvents();

  // Run task rescheduling when component mounts
  useEffect(() => {
    moveOverdueTasks();
  }, [moveOverdueTasks]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  const handleTodayClick = () => {
    setCurrentDate(new Date());
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setCurrentDate(date);
    setView('day');
  };

  const handleEventClick = (event: EventModel) => {
    setSelectedEvent(event);
    setShowEventDetailModal(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setShowEventModal(true);
  };

  const handleSaveEvent = (event: EventModel) => {
    if (selectedEvent) {
      updateEvent(event);
      toast.success('Event updated successfully!');
    } else {
      addEvent(event);
      toast.success('Event added successfully!');
    }
  };

  const handleEditEvent = () => {
    setShowEventDetailModal(false);
    setShowEventModal(true);
  };

  const handleDeleteEvent = () => {
    if (selectedEvent) {
      deleteEvent(selectedEvent.id);
      setShowEventDetailModal(false);
      toast.success('Event deleted successfully!');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="shadow-md border-border">
        <CalendarHeader
          currentDate={currentDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onAddEvent={handleAddEvent}
          onViewChange={setView}
          onTodayClick={handleTodayClick}
          currentView={view}
        />
        
        <div className="p-4">
          {view === 'month' ? (
            <MonthView
              currentDate={currentDate}
              onDayClick={handleDayClick}
              onEventClick={handleEventClick}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              onEventClick={handleEventClick}
            />
          )}
        </div>
      </Card>

      <EventModal
        show={showEventModal}
        onHide={() => setShowEventModal(false)}
        onSave={handleSaveEvent}
        event={selectedEvent}
        selectedDate={selectedDate}
      />

      {selectedEvent && (
        <EventDetailModal
          show={showEventDetailModal}
          onHide={() => setShowEventDetailModal(false)}
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
        />
      )}
    </div>
  );
};

const Calendar = () => {
  return (
    <EventProvider>
      <CalendarContent />
    </EventProvider>
  );
};

export default Calendar;

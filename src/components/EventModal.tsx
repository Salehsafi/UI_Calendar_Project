import React, { useState, useEffect } from 'react';
import { EventModel, priorityColors, priorityLevels, PriorityLevel } from '../models/EventModel';
import { v4 as uuidv4 } from 'uuid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { CalendarIcon, Clock, MapPin, FileText, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface EventModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (event: EventModel) => void;
  event?: EventModel;
  selectedDate?: Date;
}

const EventModal: React.FC<EventModalProps> = ({
  show,
  onHide,
  onSave,
  event,
  selectedDate
}) => {
  const [allDay, setAllDay] = useState(false);
  
  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      startDate: '',
      startTime: '09:00',
      endDate: '',
      endTime: '10:00',
      priority: 'medium' as PriorityLevel
    }
  });
  
  useEffect(() => {
    if (event) {
      form.reset({
        title: event.title,
        description: event.description || '',
        location: event.location || '',
        startDate: formatDateForInput(event.start),
        startTime: formatTimeForInput(event.start),
        endDate: formatDateForInput(event.end),
        endTime: formatTimeForInput(event.end),
        priority: event.priority || 'medium'
      });
      setAllDay(event.allDay || false);
    } else {
      form.reset({
        title: '',
        description: '',
        location: '',
        startDate: selectedDate ? formatDateForInput(selectedDate) : '',
        startTime: '09:00',
        endDate: selectedDate ? formatDateForInput(selectedDate) : '',
        endTime: '10:00',
        priority: 'medium'
      });
      setAllDay(false);
    }
  }, [event, selectedDate, show, form]);

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const formatTimeForInput = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const onSubmit = (values: any) => {
    const startDateTime = new Date(`${values.startDate}T${allDay ? '00:00' : values.startTime}`);
    const endDateTime = new Date(`${values.endDate}T${allDay ? '23:59' : values.endTime}`);
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    
    if (startDateTime < now) {
      form.setError('startDate', {
        type: 'manual',
        message: 'Cannot create events in the past'
      });
      return;
    }
    
    const newEvent: EventModel = {
      id: event?.id || uuidv4(),
      title: values.title,
      description: values.description,
      location: values.location,
      start: startDateTime,
      end: endDateTime,
      color: priorityColors[values.priority],
      priority: values.priority,
      allDay,
      completed: event?.completed || false
    };
    
    onSave(newEvent);
    onHide();
  };

  const priorityClasses = {
    highest: "bg-red-100 border-red-500 dark:bg-red-900/40",
    high: "bg-purple-100 border-purple-500 dark:bg-purple-900/40",
    medium: "bg-blue-100 border-blue-500 dark:bg-blue-900/40",
    low: "bg-green-100 border-green-500 dark:bg-green-900/40",
    lowest: "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/40"
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <Dialog open={show} onOpenChange={(open) => {
      if (!open) onHide();
    }}>
      <DialogContent className="sm:max-w-[550px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {event ? (
              <>
                <CalendarIcon className="h-5 w-5 text-primary" />
                Edit Event
              </>
            ) : (
              <>
                <CalendarIcon className="h-5 w-5 text-primary" />
                Create Event
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Event Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter event title" 
                      {...field} 
                      required 
                      className="focus-visible:ring-primary"
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          required 
                          min={today}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!allDay && (
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          Start Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            required={!allDay} 
                            className="focus-visible:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium flex items-center gap-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          {...field} 
                          required 
                          min={today}
                          className="focus-visible:ring-primary"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!allDay && (
                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          End Time
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                            required={!allDay} 
                            className="focus-visible:ring-primary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2 bg-muted/40 p-2 rounded-md">
              <Switch 
                id="all-day"
                checked={allDay} 
                onCheckedChange={setAllDay}
              />
              <Label htmlFor="all-day" className="text-sm font-medium cursor-pointer">All day event</Label>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Add event details or notes" 
                      className="min-h-[100px] focus-visible:ring-primary" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Add location" 
                      {...field}
                      className="focus-visible:ring-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-1">
                    <Palette className="h-3.5 w-3.5 text-muted-foreground" />
                    Priority Level
                  </FormLabel>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {priorityLevels.map((priority) => (
                      <div key={priority} className="flex items-center">
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <button
                              type="button"
                              className={cn(
                                "w-8 h-8 rounded-full border-2 transition-all",
                                field.value === priority 
                                  ? "ring-2 ring-offset-2 ring-primary" 
                                  : "opacity-70 hover:opacity-100",
                                priorityClasses[priority]
                              )}
                              onClick={() => form.setValue("priority", priority)}
                              aria-label={`Select ${priority} priority`}
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="w-auto p-2">
                            <p className="text-sm font-medium capitalize">{priority}</p>
                          </HoverCardContent>
                        </HoverCard>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4 gap-2">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onHide}
                className="border-gray-300"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary hover:bg-primary/90"
              >
                {event ? 'Update Event' : 'Create Event'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EventModal;

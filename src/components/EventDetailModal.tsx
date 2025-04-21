
import React from 'react';
import { MapPin, Clock, Trash2, Edit2 } from 'lucide-react';
import { EventModel } from '../models/EventModel';
import { formatDate, formatTime } from '../utils/calendarUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface EventDetailModalProps {
  show: boolean;
  onHide: () => void;
  event: EventModel;
  onEdit: () => void;
  onDelete: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({
  show,
  onHide,
  event,
  onEdit,
  onDelete
}) => {
  if (!event) return null;

  return (
    <Dialog open={show} onOpenChange={onHide}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className={cn("text-xl font-bold pb-2 border-b", `border-${event.color}-500`)}>
            {event.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              {event.allDay ? (
                <span className="font-medium">All day - {formatDate(event.start)}</span>
              ) : (
                <>
                  <div className="font-medium">{formatDate(event.start)}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(event.start)} - {formatTime(event.end)}
                  </div>
                </>
              )}
            </div>
          </div>

          {event.location && (
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <span>{event.location}</span>
            </div>
          )}

          {event.description && (
            <div className="mt-4 pt-4 border-t">
              <h6 className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Description</h6>
              <p className="text-foreground">{event.description}</p>
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <Button 
            variant="destructive" 
            onClick={onDelete}
            className="sm:mr-auto"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onHide} size="sm">
              Close
            </Button>
            <Button onClick={onEdit} size="sm">
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EventDetailModal;

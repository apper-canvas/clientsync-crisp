import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { contactService } from '../../services';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const activitySchema = z.object({
  type: z.string().min(1, 'Type is required'),
  subject: z.string().min(1, 'Subject is required'),
  description: z.string().optional(),
  contactId: z.string().min(1, 'Contact is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

const ActivityForm = ({ isOpen, onClose, onSubmit, initialData, title }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: 'call',
      subject: '',
      description: '',
      contactId: '',
      assignedTo: 'John Doe',
      dueDate: '',
    }
  });

  useEffect(() => {
    if (isOpen) {
      loadContacts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach(key => {
        if (key === 'dueDate') {
          // Convert ISO string to datetime-local format
          const date = new Date(initialData[key]);
          const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
          setValue(key, localDate.toISOString().slice(0, 16));
        } else {
          setValue(key, initialData[key]);
        }
      });
    } else {
      reset();
      // Set default due date to tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      const localDate = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000);
      setValue('dueDate', localDate.toISOString().slice(0, 16));
    }
  }, [initialData, reset, setValue]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit({
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
      completed: initialData?.completed || false,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Activity Type</Label>
              <Select onValueChange={(value) => setValue('type', value)} defaultValue={watch('type')}>
                <SelectTrigger className={errors.type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Select onValueChange={(value) => setValue('assignedTo', value)} defaultValue={watch('assignedTo')}>
                <SelectTrigger>
                  <SelectValue placeholder="Select assignee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="John Doe">John Doe</SelectItem>
                  <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  <SelectItem value="Mike Johnson">Mike Johnson</SelectItem>
                  <SelectItem value="Sarah Wilson">Sarah Wilson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              {...register('subject')}
              className={errors.subject ? 'border-red-500' : ''}
              placeholder="Enter activity subject..."
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter activity description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="contactId">Related Contact</Label>
            <Select onValueChange={(value) => setValue('contactId', value)} defaultValue={watch('contactId')}>
              <SelectTrigger className={errors.contactId ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select contact" />
              </SelectTrigger>
              <SelectContent>
                {contacts.map((contact) => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.firstName} {contact.lastName} - {contact.company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.contactId && (
              <p className="text-red-500 text-sm mt-1">{errors.contactId.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="dueDate">Due Date & Time</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...register('dueDate')}
              className={errors.dueDate ? 'border-red-500' : ''}
            />
            {errors.dueDate && (
              <p className="text-red-500 text-sm mt-1">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Activity' : 'Create Activity'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityForm;
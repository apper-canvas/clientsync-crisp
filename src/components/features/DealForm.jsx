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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { contactService } from '../../services';
import { DEAL_STAGES } from '../../constants/dealStages';

const dealSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  contactId: z.string().min(1, 'Contact is required'),
  value: z.number().min(0, 'Value must be positive'),
  stage: z.string().min(1, 'Stage is required'),
  probability: z.number().min(0).max(100, 'Probability must be between 0-100'),
  expectedCloseDate: z.string().min(1, 'Expected close date is required'),
  assignedTo: z.string().min(1, 'Assigned to is required'),
});

const DealForm = ({ isOpen, onClose, onSubmit, initialData, title }) => {
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
    resolver: zodResolver(dealSchema),
    defaultValues: {
      title: '',
      contactId: '',
      value: 0,
      stage: 'discovery',
      probability: 25,
      expectedCloseDate: '',
      assignedTo: 'John Doe',
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
        if (key === 'value') {
          setValue(key, Number(initialData[key]));
        } else if (key === 'expectedCloseDate') {
          setValue(key, initialData[key].split('T')[0]);
        } else {
          setValue(key, initialData[key]);
        }
      });
    } else {
      reset();
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
      value: Number(data.value),
      probability: Number(data.probability),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Deal Title</Label>
            <Input
              id="title"
              {...register('title')}
              className={errors.title ? 'border-red-500' : ''}
              placeholder="Enter deal title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="contactId">Contact</Label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="value">Deal Value ($)</Label>
              <Input
                id="value"
                type="number"
                {...register('value', { valueAsNumber: true })}
                className={errors.value ? 'border-red-500' : ''}
                placeholder="0"
              />
              {errors.value && (
                <p className="text-red-500 text-sm mt-1">{errors.value.message}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="probability">Probability (%)</Label>
              <Input
                id="probability"
                type="number"
                min="0"
                max="100"
                {...register('probability', { valueAsNumber: true })}
                className={errors.probability ? 'border-red-500' : ''}
                placeholder="25"
              />
              {errors.probability && (
                <p className="text-red-500 text-sm mt-1">{errors.probability.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="stage">Stage</Label>
            <Select onValueChange={(value) => setValue('stage', value)} defaultValue={watch('stage')}>
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                {DEAL_STAGES.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
            <Input
              id="expectedCloseDate"
              type="date"
              {...register('expectedCloseDate')}
              className={errors.expectedCloseDate ? 'border-red-500' : ''}
            />
            {errors.expectedCloseDate && (
              <p className="text-red-500 text-sm mt-1">{errors.expectedCloseDate.message}</p>
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? 'Update Deal' : 'Create Deal'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DealForm;
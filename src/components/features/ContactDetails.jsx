import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Separator } from '../ui/separator';
import ApperIcon from '../ApperIcon';
import { getInitials, formatPhoneNumber, formatDate } from '../../utils/formatters';

const ContactDetails = ({ contact, onEdit, onDelete }) => {
  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      prospect: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      lead: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      customer: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
    };
    return colors[status] || colors.prospect;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Contact Details</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(contact)}>
              <ApperIcon name="Edit" className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDelete(contact.id)}>
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg">
              {getInitials(contact.firstName, contact.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-slate-600 dark:text-slate-400">{contact.position}</p>
            <Badge className={getStatusColor(contact.status)} variant="outline">
              {contact.status}
            </Badge>
          </div>
        </div>

        <Separator />

        {/* Contact Information */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-white">Contact Information</h4>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <ApperIcon name="Mail" className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{contact.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ApperIcon name="Phone" className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Phone</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">
                  {formatPhoneNumber(contact.phone)}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <ApperIcon name="Building" className="w-4 h-4 text-slate-400" />
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Company</p>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{contact.company}</p>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Additional Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-slate-900 dark:text-white">Additional Details</h4>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Source</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                {contact.source.replace('_', ' ')}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tags</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {contact.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Created</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                {formatDate(contact.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm" className="w-full">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
            Call
          </Button>
          <Button variant="outline" size="sm" className="w-full">
            <ApperIcon name="Mail" className="w-4 h-4 mr-2" />
            Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactDetails;
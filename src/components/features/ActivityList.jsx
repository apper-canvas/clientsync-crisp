import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ApperIcon from '../ApperIcon';
import { formatDateTime } from '../../utils/formatters';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const ActivityList = ({ activities, loading, onEditActivity, onDeleteActivity, onMarkCompleted }) => {
  const getActivityType = (type) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
  };

  const sortedActivities = [...activities].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1; // Incomplete first
    }
    return new Date(a.dueDate) - new Date(b.dueDate); // Then by due date
  });

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4">
                <Skeleton className="w-4 h-4" />
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
                <Skeleton className="w-20 h-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ApperIcon name="Calendar" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No Activities Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Create your first activity to get started
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activities ({activities.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedActivities.map((activity, index) => {
            const activityType = getActivityType(activity.type);
            const isOverdue = new Date(activity.dueDate) < new Date() && !activity.completed;
            
            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-lg border transition-all duration-200 hover:shadow-md ${
                  activity.completed 
                    ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75' 
                    : isOverdue
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <Checkbox
                    checked={activity.completed}
                    onCheckedChange={() => !activity.completed && onMarkCompleted(activity.id)}
                    className="mt-1"
                  />
                  
                  <div className={`p-2 rounded-lg ${activity.completed ? 'bg-slate-100 dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-800'}`}>
                    <ApperIcon 
                      name={activityType.icon} 
                      className={`w-4 h-4 ${activity.completed ? 'text-slate-400' : activityType.color}`} 
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm font-medium ${
                          activity.completed 
                            ? 'text-slate-500 dark:text-slate-400 line-through' 
                            : 'text-slate-900 dark:text-white'
                        }`}>
                          {activity.subject}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className={`text-xs ${
                            isOverdue 
                              ? 'text-red-600 dark:text-red-400 font-medium' 
                              : 'text-slate-500 dark:text-slate-400'
                          }`}>
                            Due: {formatDateTime(activity.dueDate)}
                          </span>
                          <span className="text-xs text-slate-400">
                            {activity.assignedTo}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={activity.completed ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {activityType.label}
                        </Badge>
                        
                        {isOverdue && (
                          <Badge variant="destructive" className="text-xs">
                            Overdue
                          </Badge>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <ApperIcon name="MoreVertical" className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditActivity(activity)}>
                              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            {!activity.completed && (
                              <DropdownMenuItem onClick={() => onMarkCompleted(activity.id)}>
                                <ApperIcon name="Check" className="w-4 h-4 mr-2" />
                                Mark Complete
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              onClick={() => onDeleteActivity(activity.id)}
                              className="text-red-600"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityList;
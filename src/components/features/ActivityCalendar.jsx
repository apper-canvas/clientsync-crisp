import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import ApperIcon from '../ApperIcon';
import { formatDate, formatDateTime } from '../../utils/formatters';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const ActivityCalendar = ({ activities, loading, onEditActivity, onCreateActivity }) => {
  const getActivityType = (type) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
  };

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = formatDate(activity.dueDate);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(activity);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedActivities).sort((a, b) => 
    new Date(a) - new Date(b)
  );

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Calendar View</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <ApperIcon name="Loader2" className="w-8 h-8 text-slate-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-500 dark:text-slate-400">Loading calendar...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Calendar View
            <Button onClick={onCreateActivity}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <ApperIcon name="Calendar" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
              No Activities Scheduled
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-4">
              Create your first activity to see it on the calendar
            </p>
            <Button onClick={onCreateActivity}>
              <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Calendar View
          <Button onClick={onCreateActivity}>
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Activity
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {sortedDates.map((date) => {
            const dayActivities = groupedActivities[date];
            const isToday = formatDate(new Date()) === date;
            const isPast = new Date(date) < new Date() && !isToday;
            
            return (
              <div key={date} className="space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <ApperIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                  <h3 className={`font-medium ${
                    isToday 
                      ? 'text-indigo-600 dark:text-indigo-400' 
                      : isPast 
                      ? 'text-slate-500 dark:text-slate-400' 
                      : 'text-slate-900 dark:text-white'
                  }`}>
                    {date}
                    {isToday && (
                      <Badge variant="default" className="ml-2 text-xs">
                        Today
                      </Badge>
                    )}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {dayActivities.length} {dayActivities.length === 1 ? 'activity' : 'activities'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  {dayActivities
                    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
                    .map((activity) => {
                      const activityType = getActivityType(activity.type);
                      const isOverdue = new Date(activity.dueDate) < new Date() && !activity.completed;
                      
                      return (
                        <div
                          key={activity.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                            activity.completed 
                              ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 opacity-75'
                              : isOverdue
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                          onClick={() => onEditActivity(activity)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              activity.completed 
                                ? 'bg-slate-100 dark:bg-slate-700' 
                                : 'bg-slate-100 dark:bg-slate-800'
                            }`}>
                              <ApperIcon 
                                name={activityType.icon} 
                                className={`w-4 h-4 ${
                                  activity.completed 
                                    ? 'text-slate-400' 
                                    : activityType.color
                                }`} 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h4 className={`text-sm font-medium truncate ${
                                  activity.completed 
                                    ? 'text-slate-500 dark:text-slate-400 line-through' 
                                    : 'text-slate-900 dark:text-white'
                                }`}>
                                  {activity.subject}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge 
                                    variant={activity.completed ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {activityType.label}
                                  </Badge>
                                  {activity.completed && (
                                    <Badge variant="outline" className="text-xs">
                                      Completed
                                    </Badge>
                                  )}
                                  {isOverdue && (
                                    <Badge variant="destructive" className="text-xs">
                                      Overdue
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                {formatDateTime(activity.dueDate)} • {activity.assignedTo}
                              </p>
                              
                              {activity.description && (
                                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 truncate">
                                  {activity.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCalendar;
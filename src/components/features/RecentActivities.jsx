import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import ApperIcon from '../ApperIcon';
import { activityService } from '../../services';
import { formatDateTime } from '../../utils/formatters';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';

const RecentActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecentActivities();
  }, []);

  const loadRecentActivities = async () => {
    try {
      const data = await activityService.getAll();
      // Get the 5 most recent activities
      const recentActivities = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Failed to load recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityType = (type) => {
    return ACTIVITY_TYPES.find(t => t.value === type) || ACTIVITY_TYPES[0];
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ApperIcon name="Clock" className="w-5 h-5 mr-2 text-indigo-500" />
            Recent Activities
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="Calendar" className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 dark:text-slate-400">No recent activities</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const activityType = getActivityType(activity.type);
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-700`}>
                      <ApperIcon 
                        name={activityType.icon} 
                        className={`w-4 h-4 ${activityType.color}`} 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {activity.subject}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {formatDateTime(activity.dueDate)}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <Badge variant={activity.completed ? 'default' : 'secondary'} className="text-xs">
                          {activity.completed ? 'Completed' : 'Pending'}
                        </Badge>
                        <span className="text-xs text-slate-400">
                          {activity.assignedTo}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RecentActivities;
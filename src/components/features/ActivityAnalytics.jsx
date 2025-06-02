import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { activityService } from '../../services';
import { ACTIVITY_TYPES } from '../../constants/activityTypes';
import ApperIcon from '../ApperIcon';

const ActivityAnalytics = ({ loading }) => {
  const [activityData, setActivityData] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [completionStats, setCompletionStats] = useState({});
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    loadActivityAnalytics();
  }, []);

  const loadActivityAnalytics = async () => {
    try {
      const activities = await activityService.getAll();
      
      // Activity type distribution
      const typeData = ACTIVITY_TYPES.map((type, index) => {
        const typeActivities = activities.filter(activity => activity.type === type.value);
        const completed = typeActivities.filter(activity => activity.completed).length;
        
        return {
          name: type.label,
          total: typeActivities.length,
          completed,
          pending: typeActivities.length - completed,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
          completionRate: typeActivities.length > 0 ? (completed / typeActivities.length) * 100 : 0
        };
      }).filter(type => type.total > 0);

      // Weekly activity data (last 4 weeks)
      const weeklyData = [];
      const currentDate = new Date();
      
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(currentDate);
        weekStart.setDate(currentDate.getDate() - (i * 7) - currentDate.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekActivities = activities.filter(activity => {
          const activityDate = new Date(activity.dueDate);
          return activityDate >= weekStart && activityDate <= weekEnd;
        });
        
        const completed = weekActivities.filter(activity => activity.completed).length;
        
        weeklyData.push({
          week: `Week ${4 - i}`,
          total: weekActivities.length,
          completed,
          pending: weekActivities.length - completed,
          completionRate: weekActivities.length > 0 ? (completed / weekActivities.length) * 100 : 0
        });
      }

      // Overall completion stats
      const totalActivities = activities.length;
      const completedActivities = activities.filter(activity => activity.completed).length;
      const overdue = activities.filter(activity => 
        new Date(activity.dueDate) < new Date() && !activity.completed
      ).length;

      const stats = {
        total: totalActivities,
        completed: completedActivities,
        pending: totalActivities - completedActivities,
        overdue,
        completionRate: totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0
      };

      setActivityData(weeklyData);
      setTypeDistribution(typeData);
      setCompletionStats(stats);
    } catch (error) {
      console.error('Failed to load activity analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading || analyticsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Types</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <ApperIcon name="Calendar" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Activities</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionStats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionStats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg">
                <ApperIcon name="Clock" className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionStats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 dark:bg-red-900/50 rounded-lg">
                <ApperIcon name="AlertTriangle" className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Overdue</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{completionStats.overdue}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, total }) => `${name}: ${total}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {typeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, 'Activities']}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Activity Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="completed" 
                  stackId="a"
                  fill="hsl(var(--chart-2))" 
                  name="Completed"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="pending" 
                  stackId="a"
                  fill="hsl(var(--chart-1))" 
                  name="Pending"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Type Performance Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Type Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {typeDistribution.map((type) => (
              <div key={type.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {type.name}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {type.total} total
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {type.completed}/{type.total}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {type.completionRate.toFixed(1)}% complete
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${type.completionRate}%`,
                      backgroundColor: type.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ActivityAnalytics;
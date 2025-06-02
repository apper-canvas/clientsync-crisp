import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ApperIcon from '../components/ApperIcon';
import { activityService } from '../services';
import ActivityList from '../components/features/ActivityList';
import ActivityCalendar from '../components/features/ActivityCalendar';
import ActivityForm from '../components/features/ActivityForm';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activeTab, setActiveTab] = useState('list');

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAll();
      setActivities(data);
    } catch (error) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateActivity = async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData);
      setActivities([newActivity, ...activities]);
      setShowForm(false);
      toast.success('Activity created successfully');
    } catch (error) {
      toast.error('Failed to create activity');
    }
  };

  const handleUpdateActivity = async (id, updates) => {
    try {
      const updatedActivity = await activityService.update(id, updates);
      setActivities(activities.map(a => a.id === id ? updatedActivity : a));
      setEditingActivity(null);
      setShowForm(false);
      toast.success('Activity updated successfully');
    } catch (error) {
      toast.error('Failed to update activity');
    }
  };

  const handleDeleteActivity = async (id) => {
    try {
      await activityService.delete(id);
      setActivities(activities.filter(a => a.id !== id));
      toast.success('Activity deleted successfully');
    } catch (error) {
      toast.error('Failed to delete activity');
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      const updatedActivity = await activityService.markCompleted(id);
      setActivities(activities.map(a => a.id === id ? updatedActivity : a));
      toast.success('Activity marked as completed');
    } catch (error) {
      toast.error('Failed to update activity');
    }
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setShowForm(true);
  };

  const pendingActivities = activities.filter(a => !a.completed);
  const completedActivities = activities.filter(a => a.completed);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Activities</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your tasks and appointments</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <ApperIcon name="Clock" className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{pendingActivities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <ApperIcon name="CheckCircle" className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{completedActivities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <ApperIcon name="Calendar" className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{activities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list" className="flex items-center">
            <ApperIcon name="List" className="w-4 h-4 mr-2" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <ApperIcon name="Calendar" className="w-4 h-4 mr-2" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <ActivityList
            activities={activities}
            loading={loading}
            onEditActivity={handleEditActivity}
            onDeleteActivity={handleDeleteActivity}
            onMarkCompleted={handleMarkCompleted}
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <ActivityCalendar
            activities={activities}
            loading={loading}
            onEditActivity={handleEditActivity}
            onCreateActivity={() => setShowForm(true)}
          />
        </TabsContent>
      </Tabs>

      {/* Activity Form Modal */}
      <ActivityForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingActivity(null);
        }}
        onSubmit={editingActivity ? 
          (data) => handleUpdateActivity(editingActivity.id, data) : 
          handleCreateActivity
        }
        initialData={editingActivity}
        title={editingActivity ? 'Edit Activity' : 'Add New Activity'}
      />
    </div>
  );
};

export default Activities;
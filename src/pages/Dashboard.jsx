import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import ApperIcon from '../components/ApperIcon';
import { contactService, dealService, activityService } from '../services';
import { formatCurrency } from '../utils/formatters';
import DashboardStats from '../components/features/DashboardStats';
import RecentActivities from '../components/features/RecentActivities';
import PipelineOverview from '../components/features/PipelineOverview';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalContacts: 0,
    totalDeals: 0,
    totalValue: 0,
    activeActivities: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
      const activeActivities = activities.filter(activity => !activity.completed).length;

      setStats({
        totalContacts: contacts.length,
        totalDeals: deals.length,
        totalValue,
        activeActivities
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
          <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <DashboardStats stats={stats} loading={loading} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Overview */}
        <div className="lg:col-span-2">
          <PipelineOverview />
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-1">
          <RecentActivities />
        </div>
      </div>

      {/* Quick Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <ApperIcon name="Zap" className="w-5 h-5 mr-2 text-yellow-500" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <ApperIcon name="UserPlus" className="w-6 h-6 text-blue-500" />
                <span className="text-sm">Add Contact</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <ApperIcon name="Target" className="w-6 h-6 text-green-500" />
                <span className="text-sm">Create Deal</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <ApperIcon name="Calendar" className="w-6 h-6 text-purple-500" />
                <span className="text-sm">Schedule Call</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <ApperIcon name="Mail" className="w-6 h-6 text-orange-500" />
                <span className="text-sm">Send Email</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
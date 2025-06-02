import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import ApperIcon from '../components/ApperIcon';
import { contactService, dealService, activityService } from '../services';
import SalesChart from '../components/features/SalesChart';
import PipelineAnalytics from '../components/features/PipelineAnalytics';
import ActivityAnalytics from '../components/features/ActivityAnalytics';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 0,
    avgDealSize: 0,
    conversionRate: 0,
    totalContacts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [contacts, deals, activities] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll()
      ]);

      const wonDeals = deals.filter(deal => deal.status === 'won');
      const totalRevenue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
      const avgDealSize = wonDeals.length > 0 ? totalRevenue / wonDeals.length : 0;
      const conversionRate = deals.length > 0 ? (wonDeals.length / deals.length) * 100 : 0;

      setAnalyticsData({
        totalRevenue,
        avgDealSize,
        conversionRate,
        totalContacts: contacts.length
      });
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Analytics</h1>
          <p className="text-slate-600 dark:text-slate-400">Insights into your sales performance</p>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-500 rounded-lg">
                  <ApperIcon name="DollarSign" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</p>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                    {formatCurrency(analyticsData.totalRevenue)}
                  </p>
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
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <ApperIcon name="TrendingUp" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Avg Deal Size</p>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(analyticsData.avgDealSize)}
                  </p>
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
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <ApperIcon name="Target" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Conversion Rate</p>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                    {analyticsData.conversionRate.toFixed(1)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-500 rounded-lg">
                  <ApperIcon name="Users" className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Total Contacts</p>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                    {analyticsData.totalContacts}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sales" className="flex items-center">
            <ApperIcon name="BarChart3" className="w-4 h-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="flex items-center">
            <ApperIcon name="Target" className="w-4 h-4 mr-2" />
            Pipeline
          </TabsTrigger>
          <TabsTrigger value="activities" className="flex items-center">
            <ApperIcon name="Activity" className="w-4 h-4 mr-2" />
            Activities
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sales">
          <SalesChart loading={loading} />
        </TabsContent>

        <TabsContent value="pipeline">
          <PipelineAnalytics loading={loading} />
        </TabsContent>

        <TabsContent value="activities">
          <ActivityAnalytics loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;
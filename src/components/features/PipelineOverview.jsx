import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import ApperIcon from '../ApperIcon';
import { dealService } from '../../services';
import { formatCurrency } from '../../utils/formatters';
import { DEAL_STAGES } from '../../constants/dealStages';

const PipelineOverview = () => {
  const [pipelineData, setPipelineData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalValue, setTotalValue] = useState(0);

  useEffect(() => {
    loadPipelineData();
  }, []);

  const loadPipelineData = async () => {
    try {
      const deals = await dealService.getAll();
      
      // Group deals by stage and calculate values
      const stageData = DEAL_STAGES.map(stage => {
        const stageDeals = deals.filter(deal => deal.stage === stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
        
        return {
          ...stage,
          count: stageDeals.length,
          value: stageValue,
          deals: stageDeals
        };
      });

      const total = deals.reduce((sum, deal) => sum + deal.value, 0);
      
      setPipelineData(stageData);
      setTotalValue(total);
    } catch (error) {
      console.error('Failed to load pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <ApperIcon name="TrendingUp" className="w-5 h-5 mr-2 text-green-500" />
              Pipeline Overview
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Value</p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {pipelineData.map((stage, index) => {
              const percentage = totalValue > 0 ? (stage.value / totalValue) * 100 : 0;
              
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${stage.color}`}>
                        {stage.name}
                      </span>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {stage.count} deals
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {formatCurrency(stage.value)}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PipelineOverview;
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { Skeleton } from '../ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { dealService } from '../../services';
import { formatCurrency } from '../../utils/formatters';
import { DEAL_STAGES } from '../../constants/dealStages';

const PipelineAnalytics = ({ loading }) => {
  const [pipelineData, setPipelineData] = useState([]);
  const [stageData, setStageData] = useState([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    loadPipelineAnalytics();
  }, []);

  const loadPipelineAnalytics = async () => {
    try {
      const deals = await dealService.getAll();
      
      // Calculate stage distribution
      const stageAnalytics = DEAL_STAGES.map((stage, index) => {
        const stageDeals = deals.filter(deal => deal.stage === stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
        
        return {
          name: stage.name,
          value: stageValue,
          count: stageDeals.length,
          color: `hsl(var(--chart-${(index % 5) + 1}))`,
          percentage: deals.length > 0 ? (stageDeals.length / deals.length) * 100 : 0
        };
      }).filter(stage => stage.count > 0);

      // Calculate conversion rates between stages
      const conversionData = DEAL_STAGES.slice(0, -2).map((stage, index) => {
        const currentStageDeals = deals.filter(deal => deal.stage === stage.id).length;
        const nextStage = DEAL_STAGES[index + 1];
        const nextStageDeals = deals.filter(deal => deal.stage === nextStage?.id).length;
        
        const conversionRate = currentStageDeals > 0 ? (nextStageDeals / currentStageDeals) * 100 : 0;
        
        return {
          stage: stage.name,
          conversion: Math.round(conversionRate),
          deals: currentStageDeals
        };
      });

      setPipelineData(stageAnalytics);
      setStageData(conversionData);
    } catch (error) {
      console.error('Failed to load pipeline analytics:', error);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  if (loading || analyticsLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Stage Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pipeline Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pipelineData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pipelineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [formatCurrency(value), 'Value']}
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

        {/* Conversion Rates */}
        <Card>
          <CardHeader>
            <CardTitle>Stage Conversion Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stageData} layout="horizontal">
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="stage" type="category" width={80} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Conversion Rate']}
                  contentStyle={{
                    backgroundColor: 'var(--card)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                  }}
                />
                <Bar 
                  dataKey="conversion" 
                  fill="hsl(var(--chart-4))"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Stage Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pipelineData.map((stage, index) => (
              <div key={stage.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span className="font-medium text-slate-900 dark:text-white">
                      {stage.name}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {stage.count} deals
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(stage.value)}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {stage.percentage.toFixed(1)}% of total
                    </p>
                  </div>
                </div>
                <Progress value={stage.percentage} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PipelineAnalytics;
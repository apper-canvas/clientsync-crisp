import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import ApperIcon from '../ApperIcon';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { DEAL_STAGES } from '../../constants/dealStages';
import { contactService } from '../../services';

const PipelineBoard = ({ deals, loading, onMoveDeal, onEditDeal, onDeleteDeal }) => {
  const [contacts, setContacts] = useState({});

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const contactData = await contactService.getAll();
      const contactMap = contactData.reduce((acc, contact) => {
        acc[contact.id] = contact;
        return acc;
      }, {});
      setContacts(contactMap);
    } catch (error) {
      console.error('Failed to load contacts:', error);
    }
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  const getDealContact = (contactId) => {
    return contacts[contactId] || { firstName: 'Unknown', lastName: 'Contact' };
  };

  const handleDragStart = (e, deal) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(deal));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStage) => {
    e.preventDefault();
    const deal = JSON.parse(e.dataTransfer.getData('text/plain'));
    if (deal.stage !== targetStage) {
      onMoveDeal(deal.id, targetStage);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {DEAL_STAGES.map((stage) => (
          <Card key={stage.id} className="min-h-[400px]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">
                <Skeleton className="h-4 w-20" />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {DEAL_STAGES.map((stage, stageIndex) => {
        const stageDeals = getDealsForStage(stage.id);
        const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);

        return (
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stageIndex * 0.1 }}
          >
            <Card 
              className="min-h-[500px] pipeline-stage"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${stage.color}`}>
                    {stage.name}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {stageDeals.length}
                  </Badge>
                </CardTitle>
                <div className="text-right">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Total Value</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(stageValue)}
                  </p>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-3">
                {stageDeals.map((deal, dealIndex) => {
                  const contact = getDealContact(deal.contactId);
                  
                  return (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: dealIndex * 0.05 }}
                      className="deal-card p-3"
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-white truncate">
                          {deal.title}
                        </h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <ApperIcon name="MoreHorizontal" className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onEditDeal(deal)}>
                              <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => onDeleteDeal(deal.id)}
                              className="text-red-600"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {contact.firstName} {contact.lastName}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-slate-900 dark:text-white">
                            {formatCurrency(deal.value)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {deal.probability}%
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                          <span>Due: {formatDate(deal.expectedCloseDate)}</span>
                          <span>{deal.assignedTo}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
                
                {stageDeals.length === 0 && (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-600">
                    <ApperIcon name="Target" className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-xs">No deals in this stage</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PipelineBoard;
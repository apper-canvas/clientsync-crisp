import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Button } from '../components/ui/button';
import ApperIcon from '../components/ApperIcon';
import { dealService } from '../services';
import PipelineBoard from '../components/features/PipelineBoard';
import DealForm from '../components/features/DealForm';

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await dealService.getAll();
      setDeals(data);
    } catch (error) {
      toast.error('Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeal = async (dealData) => {
    try {
      const newDeal = await dealService.create(dealData);
      setDeals([newDeal, ...deals]);
      setShowForm(false);
      toast.success('Deal created successfully');
    } catch (error) {
      toast.error('Failed to create deal');
    }
  };

  const handleUpdateDeal = async (id, updates) => {
    try {
      const updatedDeal = await dealService.update(id, updates);
      setDeals(deals.map(d => d.id === id ? updatedDeal : d));
      setEditingDeal(null);
      setShowForm(false);
      toast.success('Deal updated successfully');
    } catch (error) {
      toast.error('Failed to update deal');
    }
  };

  const handleDeleteDeal = async (id) => {
    try {
      await dealService.delete(id);
      setDeals(deals.filter(d => d.id !== id));
      toast.success('Deal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete deal');
    }
  };

  const handleMoveDeal = async (dealId, newStage) => {
    try {
      const updatedDeal = await dealService.updateStage(dealId, newStage);
      setDeals(deals.map(d => d.id === dealId ? updatedDeal : d));
      toast.success('Deal moved successfully');
    } catch (error) {
      toast.error('Failed to move deal');
    }
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setShowForm(true);
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sales Pipeline</h1>
          <p className="text-slate-600 dark:text-slate-400">Track and manage your deals through the sales process</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            <ApperIcon name="Plus" className="w-4 h-4 mr-2" />
            Add Deal
          </Button>
        </div>
      </motion.div>

      {/* Pipeline Board */}
      <PipelineBoard
        deals={deals}
        loading={loading}
        onMoveDeal={handleMoveDeal}
        onEditDeal={handleEditDeal}
        onDeleteDeal={handleDeleteDeal}
      />

      {/* Deal Form Modal */}
      <DealForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingDeal(null);
        }}
        onSubmit={editingDeal ? 
          (data) => handleUpdateDeal(editingDeal.id, data) : 
          handleCreateDeal
        }
        initialData={editingDeal}
        title={editingDeal ? 'Edit Deal' : 'Add New Deal'}
      />
    </div>
  );
};

export default Deals;
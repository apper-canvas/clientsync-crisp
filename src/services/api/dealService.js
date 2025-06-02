import dealData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...dealData.deals];
  },
  
  async getById(id) {
    await delay(200);
    const deal = dealData.deals.find(d => d.id === id);
    if (!deal) throw new Error('Deal not found');
    return { ...deal };
  },
  
  async create(deal) {
    await delay(400);
    const newDeal = {
      id: Date.now().toString(),
      ...deal,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    dealData.deals.push(newDeal);
    return newDeal;
  },
  
  async update(id, updates) {
    await delay(300);
    const index = dealData.deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    dealData.deals[index] = { 
      ...dealData.deals[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return dealData.deals[index];
  },
  
  async delete(id) {
    await delay(300);
    const index = dealData.deals.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Deal not found');
    dealData.deals.splice(index, 1);
    return { success: true };
  },

  async getByStage(stage) {
    await delay(250);
    return dealData.deals.filter(deal => deal.stage === stage);
  },

  async updateStage(id, newStage) {
    await delay(200);
    return this.update(id, { stage: newStage });
  }
};
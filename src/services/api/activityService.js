import activityData from '../mockData/activities.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const activityService = {
  async getAll() {
    await delay(300);
    return [...activityData.activities];
  },
  
  async getById(id) {
    await delay(200);
    const activity = activityData.activities.find(a => a.id === id);
    if (!activity) throw new Error('Activity not found');
    return { ...activity };
  },
  
  async create(activity) {
    await delay(400);
    const newActivity = {
      id: Date.now().toString(),
      ...activity,
      createdAt: new Date().toISOString()
    };
    activityData.activities.push(newActivity);
    return newActivity;
  },
  
  async update(id, updates) {
    await delay(300);
    const index = activityData.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    activityData.activities[index] = { ...activityData.activities[index], ...updates };
    return activityData.activities[index];
  },
  
  async delete(id) {
    await delay(300);
    const index = activityData.activities.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Activity not found');
    activityData.activities.splice(index, 1);
    return { success: true };
  },

  async getByContact(contactId) {
    await delay(250);
    return activityData.activities.filter(activity => activity.contactId === contactId);
  },

  async markCompleted(id) {
    await delay(200);
    return this.update(id, { completed: true });
  }
};
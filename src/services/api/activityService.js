export const activityService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'type', 'due_date', 
          'completed', 'contact_id'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('Activity1', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  },
  
  async getById(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'type', 'due_date', 
          'completed', 'contact_id'
        ]
      };

      const response = await apperClient.getRecordById('Activity1', id, params);
      return response?.data;
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error);
      throw error;
    }
  },
  
  async create(activityData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: activityData.Name || '',
          Tags: activityData.Tags || '',
          Owner: activityData.Owner || '',
          title: activityData.title || '',
          type: activityData.type || 'Task',
          due_date: activityData.due_date || '',
          completed: activityData.completed || false,
          contact_id: activityData.contact_id || ''
        }]
      };

      const response = await apperClient.createRecord('Activity1', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to create activity');
    } catch (error) {
      console.error('Error creating activity:', error);
      throw error;
    }
  },
  
  async update(id, updates) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus ID
      const params = {
        records: [{
          Id: id,
          Name: updates.Name,
          Tags: updates.Tags,
          Owner: updates.Owner,
          title: updates.title,
          type: updates.type,
          due_date: updates.due_date,
          completed: updates.completed,
          contact_id: updates.contact_id
        }]
      };

      const response = await apperClient.updateRecord('Activity1', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to update activity');
    } catch (error) {
      console.error('Error updating activity:', error);
      throw error;
    }
  },
  
  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('Activity1', params);
      if (response?.success) {
        return { success: true };
      }
      throw new Error('Failed to delete activity');
    } catch (error) {
      console.error('Error deleting activity:', error);
      throw error;
    }
  },

  async getByContact(contactId) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'type', 'due_date', 
          'completed', 'contact_id'
        ],
        where: [
          {
            fieldName: 'contact_id',
            operator: 'EqualTo',
            values: [contactId]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('Activity1', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching activities by contact:', error);
      throw error;
    }
  },

  async markCompleted(id) {
    return this.update(id, { completed: true });
  }
};
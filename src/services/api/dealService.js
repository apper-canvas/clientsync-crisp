export const dealService = {
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
          'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 
          'close_date', 'contact_id'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('deal', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching deals:', error);
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
          'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 
          'close_date', 'contact_id'
        ]
      };

      const response = await apperClient.getRecordById('deal', id, params);
      return response?.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  },
  
  async create(dealData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: dealData.Name || '',
          Tags: dealData.Tags || '',
          Owner: dealData.Owner || '',
          title: dealData.title || '',
          value: dealData.value || 0,
          stage: dealData.stage || 'Prospecting',
          close_date: dealData.close_date || '',
          contact_id: dealData.contact_id || ''
        }]
      };

      const response = await apperClient.createRecord('deal', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to create deal');
    } catch (error) {
      console.error('Error creating deal:', error);
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
          value: updates.value,
          stage: updates.stage,
          close_date: updates.close_date,
          contact_id: updates.contact_id
        }]
      };

      const response = await apperClient.updateRecord('deal', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to update deal');
    } catch (error) {
      console.error('Error updating deal:', error);
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

      const response = await apperClient.deleteRecord('deal', params);
      if (response?.success) {
        return { success: true };
      }
      throw new Error('Failed to delete deal');
    } catch (error) {
      console.error('Error deleting deal:', error);
      throw error;
    }
  },

  async getByStage(stage) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'title', 'value', 'stage', 
          'close_date', 'contact_id'
        ],
        where: [
          {
            fieldName: 'stage',
            operator: 'ExactMatch',
            values: [stage]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('deal', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching deals by stage:', error);
      throw error;
    }
  },

  async updateStage(id, newStage) {
    return this.update(id, { stage: newStage });
  }
};
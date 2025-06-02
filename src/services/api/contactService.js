export const contactService = {
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
          'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 
          'email', 'phone', 'company', 'title'
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('contact', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
          'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 
          'email', 'phone', 'company', 'title'
        ]
      };

      const response = await apperClient.getRecordById('contact', id, params);
      return response?.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  },
  
  async create(contactData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const params = {
        records: [{
          Name: contactData.Name || '',
          Tags: contactData.Tags || '',
          Owner: contactData.Owner || '',
          first_name: contactData.first_name || '',
          last_name: contactData.last_name || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          company: contactData.company || '',
          title: contactData.title || ''
        }]
      };

      const response = await apperClient.createRecord('contact', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to create contact');
    } catch (error) {
      console.error('Error creating contact:', error);
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
          first_name: updates.first_name,
          last_name: updates.last_name,
          email: updates.email,
          phone: updates.phone,
          company: updates.company,
          title: updates.title
        }]
      };

      const response = await apperClient.updateRecord('contact', params);
      if (response?.success && response?.results?.[0]?.success) {
        return response.results[0].data;
      }
      throw new Error('Failed to update contact');
    } catch (error) {
      console.error('Error updating contact:', error);
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

      const response = await apperClient.deleteRecord('contact', params);
      if (response?.success) {
        return { success: true };
      }
      throw new Error('Failed to delete contact');
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }
  },

  async search(query) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
          'ModifiedOn', 'ModifiedBy', 'first_name', 'last_name', 
          'email', 'phone', 'company', 'title'
        ],
        where: [
          {
            fieldName: 'first_name',
            operator: 'Contains',
            values: [query]
          }
        ],
        pagingInfo: {
          limit: 100,
          offset: 0
        }
      };

      const response = await apperClient.fetchRecords('contact', params);
      return response?.data || [];
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw error;
    }
  }
};
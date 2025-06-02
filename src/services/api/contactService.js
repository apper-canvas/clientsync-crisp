import contactData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contactData.contacts];
  },
  
  async getById(id) {
    await delay(200);
    const contact = contactData.contacts.find(c => c.id === id);
    if (!contact) throw new Error('Contact not found');
    return { ...contact };
  },
  
  async create(contact) {
    await delay(400);
    const newContact = {
      id: Date.now().toString(),
      ...contact,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    contactData.contacts.push(newContact);
    return newContact;
  },
  
  async update(id, updates) {
    await delay(300);
    const index = contactData.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    contactData.contacts[index] = { 
      ...contactData.contacts[index], 
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return contactData.contacts[index];
  },
  
  async delete(id) {
    await delay(300);
    const index = contactData.contacts.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Contact not found');
    contactData.contacts.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(250);
    const lowercaseQuery = query.toLowerCase();
    return contactData.contacts.filter(contact => 
      contact.firstName.toLowerCase().includes(lowercaseQuery) ||
      contact.lastName.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery)
    );
  }
};
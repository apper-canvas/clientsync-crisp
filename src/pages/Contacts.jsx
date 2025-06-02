import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ApperIcon from '../components/ApperIcon';
import { contactService } from '../services';
import ContactList from '../components/features/ContactList';
import ContactForm from '../components/features/ContactForm';
import ContactDetails from '../components/features/ContactDetails';

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchQuery]);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    if (!searchQuery.trim()) {
      setFilteredContacts(contacts);
      return;
    }

    const filtered = contacts.filter(contact =>
      contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleCreateContact = async (contactData) => {
    try {
      const newContact = await contactService.create(contactData);
      setContacts([newContact, ...contacts]);
      setShowForm(false);
      toast.success('Contact created successfully');
    } catch (error) {
      toast.error('Failed to create contact');
    }
  };

  const handleUpdateContact = async (id, updates) => {
    try {
      const updatedContact = await contactService.update(id, updates);
      setContacts(contacts.map(c => c.id === id ? updatedContact : c));
      setEditingContact(null);
      setShowForm(false);
      toast.success('Contact updated successfully');
    } catch (error) {
      toast.error('Failed to update contact');
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await contactService.delete(id);
      setContacts(contacts.filter(c => c.id !== id));
      setSelectedContact(null);
      toast.success('Contact deleted successfully');
    } catch (error) {
      toast.error('Failed to delete contact');
    }
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Contacts</h1>
          <p className="text-slate-600 dark:text-slate-400">Manage your customer relationships</p>
        </div>
        <Button 
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <ApperIcon name="UserPlus" className="w-4 h-4 mr-2" />
          Add Contact
        </Button>
      </motion.div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <ApperIcon name="Filter" className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline">
              <ApperIcon name="Download" className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact List */}
        <div className="lg:col-span-2">
          <ContactList
            contacts={filteredContacts}
            loading={loading}
            onSelectContact={setSelectedContact}
            onEditContact={handleEditContact}
            onDeleteContact={handleDeleteContact}
            selectedContactId={selectedContact?.id}
          />
        </div>

        {/* Contact Details */}
        <div className="lg:col-span-1">
          {selectedContact ? (
            <ContactDetails
              contact={selectedContact}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-12">
                  <ApperIcon name="Users" className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-2">
                    No Contact Selected
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    Select a contact from the list to view details
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingContact(null);
        }}
        onSubmit={editingContact ? 
          (data) => handleUpdateContact(editingContact.id, data) : 
          handleCreateContact
        }
        initialData={editingContact}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
      />
    </div>
  );
};

export default Contacts;
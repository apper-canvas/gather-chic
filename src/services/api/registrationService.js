class RegistrationService {
  constructor() {
    // Initialize ApperClient for database operations
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getRegistrationCountForEvent(eventId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["confirmed"]}
        ]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);
      
      if (!response.success) {
        console.error("Failed to get registration count:", response.message);
        return 0;
      }

      return response.data ? response.data.length : 0;
    } catch (error) {
      console.error("Error getting registration count:", error.message);
      return 0;
    }
  }

  async getWaitlistCountForEvent(eventId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [{"field": {"Name": "Id"}}],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["waitlist"]}
        ]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);
      
      if (!response.success) {
        console.error("Failed to get waitlist count:", response.message);
        return 0;
      }

      return response.data ? response.data.length : 0;
    } catch (error) {
      console.error("Error getting waitlist count:", error.message);
      return 0;
    }
  }

  async getWaitlistPositionForUser(eventId, userId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "user_id_c"}}, {"field": {"Name": "CreatedOn"}}],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["waitlist"]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "ASC"}]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);
      
      if (!response.success) {
        console.error("Failed to get waitlist position:", response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      const userIndex = response.data.findIndex(reg => reg.user_id_c === parseInt(userId));
      return userIndex >= 0 ? userIndex + 1 : null;
    } catch (error) {
      console.error("Error getting waitlist position:", error.message);
      return null;
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);

      if (!response.success) {
        console.error("Failed to fetch registrations:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to application field names
      const transformedRegistrations = response.data?.map(registration => ({
        Id: registration.Id,
        eventId: registration.event_id_c?.Id || registration.event_id_c,
        status: registration.status_c || '',
        userId: registration.user_id_c || '',
        registeredAt: registration.CreatedOn || '',
        updatedAt: registration.ModifiedOn || ''
      })) || [];

      return transformedRegistrations;
    } catch (error) {
      console.error("Error fetching registrations:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById('registration_c', id, params);

      if (!response.success) {
        console.error(`Failed to fetch registration ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Registration not found");
      }

      // Transform database field names to application field names
      const registration = response.data;
      return {
        Id: registration.Id,
        eventId: registration.event_id_c?.Id || registration.event_id_c,
        status: registration.status_c || '',
        userId: registration.user_id_c || '',
        registeredAt: registration.CreatedOn || '',
        updatedAt: registration.ModifiedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching registration ${id}:`, error.message);
      throw error;
    }
  }

  async create(registrationData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Import event service to check capacity
      const { eventService } = await import('./eventService.js');
      const event = await eventService.getById(registrationData.eventId);
      const confirmedCount = await this.getRegistrationCountForEvent(registrationData.eventId);
      
      // Determine registration status based on capacity
      const status = confirmedCount >= event.capacity ? "waitlist" : "confirmed";

      // Transform application field names to database field names, only include Updateable fields
      const params = {
        records: [{
          Name: `Registration for ${event.title}`,
          event_id_c: parseInt(registrationData.eventId),
          status_c: status,
          user_id_c: parseInt(registrationData.userId) || 0
        }]
      };

      const response = await this.apperClient.createRecord('registration_c', params);

      if (!response.success) {
        console.error("Failed to create registration:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} registrations:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const createdRegistration = successful[0].data;
          
          // Transform back to application field names
          const newRegistration = {
            Id: createdRegistration.Id,
            eventId: registrationData.eventId,
            status: status,
            userId: registrationData.userId,
            userEmail: registrationData.userEmail,
            userName: registrationData.userName,
            registeredAt: createdRegistration.CreatedOn || new Date().toISOString(),
            updatedAt: createdRegistration.ModifiedOn || new Date().toISOString()
          };

          // Send notification email after successful registration
          if (registrationData.userEmail) {
            try {
              // Initialize ApperClient for email notifications
              const { ApperClient } = window.ApperSDK || {};
              if (ApperClient) {
                const apperClient = new ApperClient({
                  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
                });

                // Prepare email data
                const emailData = {
                  type: status === 'confirmed' ? 'registration_confirmation' : 'waitlist_confirmation',
                  to: registrationData.userEmail,
                  data: {
                    userName: registrationData.userName || 'Event Participant',
                    eventTitle: event.title,
                    eventDate: new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }),
                    eventTime: `${event.startTime} - ${event.endTime}`,
                    eventLocation: event.location,
                    status: status,
                    registrationId: newRegistration.Id,
                    eventId: event.Id
                  }
                };

                // Send notification email
                await apperClient.functions.invoke(import.meta.env.VITE_SEND_NOTIFICATION_EMAIL, {
                  body: JSON.stringify(emailData),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              }
            } catch (emailError) {
              // Log email error but don't fail the registration
              console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_NOTIFICATION_EMAIL}. The error is: ${emailError.message}`);
            }
          }
          
          return newRegistration;
        }
      }

      throw new Error("No registration created");
    } catch (error) {
      console.error("Error creating registration:", error.message);
      throw error;
    }
  }

  async update(id, registrationData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Get current registration to compare status changes
      const currentRegistration = await this.getById(id);

      // Transform application field names to database field names, only include Updateable fields
      const updateFields = {};
      if (registrationData.status !== undefined) {
        updateFields.status_c = registrationData.status;
      }
      if (registrationData.eventId !== undefined) {
        updateFields.event_id_c = parseInt(registrationData.eventId);
      }
      if (registrationData.userId !== undefined) {
        updateFields.user_id_c = parseInt(registrationData.userId);
      }

      const params = {
        records: [{
          Id: id,
          ...updateFields
        }]
      };

      const response = await this.apperClient.updateRecord('registration_c', params);

      if (!response.success) {
        console.error("Failed to update registration:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} registrations:`, failed);
          failed.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                throw new Error(`${error.fieldLabel}: ${error.message}`);
              });
            }
            if (record.message) throw new Error(record.message);
          });
        }

        if (successful.length > 0) {
          const updatedRegistration = successful[0].data;
          
          // Transform back to application field names
          const newRegistration = {
            Id: updatedRegistration.Id,
            eventId: updatedRegistration.event_id_c?.Id || updatedRegistration.event_id_c || currentRegistration.eventId,
            status: updatedRegistration.status_c || currentRegistration.status,
            userId: updatedRegistration.user_id_c || currentRegistration.userId,
            registeredAt: updatedRegistration.CreatedOn || currentRegistration.registeredAt,
            updatedAt: updatedRegistration.ModifiedOn || new Date().toISOString()
          };

          // Send notification if status changed from waitlist to confirmed
          if (currentRegistration.status === 'waitlist' && 
              registrationData.status === 'confirmed' && 
              registrationData.userEmail) {
            
            try {
              const { eventService } = await import('./eventService.js');
              const event = await eventService.getById(newRegistration.eventId);
              
              const { ApperClient } = window.ApperSDK || {};
              if (ApperClient) {
                const apperClient = new ApperClient({
                  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
                  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
                });

                const emailData = {
                  type: 'registration_confirmation',
                  to: registrationData.userEmail,
                  data: {
                    userName: registrationData.userName || 'Event Participant',
                    eventTitle: event.title,
                    eventDate: new Date(event.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }),
                    eventTime: `${event.startTime} - ${event.endTime}`,
                    eventLocation: event.location,
                    status: 'confirmed',
                    registrationId: newRegistration.Id,
                    eventId: event.Id
                  }
                };

                await apperClient.functions.invoke(import.meta.env.VITE_SEND_NOTIFICATION_EMAIL, {
                  body: JSON.stringify(emailData),
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              }
            } catch (emailError) {
              console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_SEND_NOTIFICATION_EMAIL}. The error is: ${emailError.message}`);
            }
          }
          
          return newRegistration;
        }
      }

      throw new Error("No registration updated");
    } catch (error) {
      console.error("Error updating registration:", error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('registration_c', params);

      if (!response.success) {
        console.error("Failed to delete registration:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} registrations:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return { success: successful.length > 0 };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting registration:", error.message);
      throw error;
    }
  }

  async getByEventId(eventId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);

      if (!response.success) {
        console.error("Failed to fetch registrations by event:", response.message);
        return [];
      }

      // Transform database field names to application field names
      const transformedRegistrations = response.data?.map(registration => ({
        Id: registration.Id,
        eventId: registration.event_id_c?.Id || registration.event_id_c,
        status: registration.status_c || '',
        userId: registration.user_id_c || '',
        registeredAt: registration.CreatedOn || '',
        updatedAt: registration.ModifiedOn || ''
      })) || [];

      return transformedRegistrations;
    } catch (error) {
      console.error("Error fetching registrations by event:", error.message);
      return [];
    }
  }

  async getByUserId(userId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);

      if (!response.success) {
        console.error("Failed to fetch registrations by user:", response.message);
        return [];
      }

      // Transform database field names to application field names
      const transformedRegistrations = response.data?.map(registration => ({
        Id: registration.Id,
        eventId: registration.event_id_c?.Id || registration.event_id_c,
        status: registration.status_c || '',
        userId: registration.user_id_c || '',
        registeredAt: registration.CreatedOn || '',
        updatedAt: registration.ModifiedOn || ''
      })) || [];

      return transformedRegistrations;
    } catch (error) {
      console.error("Error fetching registrations by user:", error.message);
      return [];
    }
  }

  async getUserRegistrationForEvent(eventId, userId) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "event_id_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "user_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        where: [
          {"FieldName": "event_id_c", "Operator": "EqualTo", "Values": [parseInt(eventId)]},
          {"FieldName": "user_id_c", "Operator": "EqualTo", "Values": [parseInt(userId)]}
        ]
      };

      const response = await this.apperClient.fetchRecords('registration_c', params);

      if (!response.success) {
        console.error("Failed to fetch user registration for event:", response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      // Transform database field names to application field names
      const registration = response.data[0];
      return {
        Id: registration.Id,
        eventId: registration.event_id_c?.Id || registration.event_id_c,
        status: registration.status_c || '',
        userId: registration.user_id_c || '',
        registeredAt: registration.CreatedOn || '',
        updatedAt: registration.ModifiedOn || ''
      };
    } catch (error) {
      console.error("Error fetching user registration for event:", error.message);
      return null;
    }
  }
}

export const registrationService = new RegistrationService();
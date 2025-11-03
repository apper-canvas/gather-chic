class EventService {
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

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      };

      const response = await this.apperClient.fetchRecords('event_c', params);

      if (!response.success) {
        console.error("Failed to fetch events:", response.message);
        throw new Error(response.message);
      }

      // Transform database field names to application field names
      const transformedEvents = response.data.map(event => ({
        Id: event.Id,
        title: event.title_c || '',
        description: event.description_c || '',
        category: event.category_c || '',
        date: event.date_c || '',
        startTime: event.start_time_c || '',
        endTime: event.end_time_c || '',
        location: event.location_c || '',
        capacity: event.capacity_c || 0,
        imageUrl: event.image_url_c || '',
        isFeatured: event.is_featured_c || false,
        organizerId: event.organizer_id_c || '',
        createdAt: event.CreatedOn || '',
        updatedAt: event.ModifiedOn || ''
      }));

      return transformedEvents;
    } catch (error) {
      console.error("Error fetching events:", error.message);
      throw error;
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "start_time_c"}},
          {"field": {"Name": "end_time_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "capacity_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "is_featured_c"}},
          {"field": {"Name": "organizer_id_c"}},
          {"field": {"Name": "CreatedOn"}},
          {"field": {"Name": "ModifiedOn"}}
        ]
      };

      const response = await this.apperClient.getRecordById('event_c', id, params);

      if (!response.success) {
        console.error(`Failed to fetch event ${id}:`, response.message);
        throw new Error(response.message);
      }

      if (!response.data) {
        throw new Error("Event not found");
      }

      // Transform database field names to application field names
      const event = response.data;
      return {
        Id: event.Id,
        title: event.title_c || '',
        description: event.description_c || '',
        category: event.category_c || '',
        date: event.date_c || '',
        startTime: event.start_time_c || '',
        endTime: event.end_time_c || '',
        location: event.location_c || '',
        capacity: event.capacity_c || 0,
        imageUrl: event.image_url_c || '',
        isFeatured: event.is_featured_c || false,
        organizerId: event.organizer_id_c || '',
        createdAt: event.CreatedOn || '',
        updatedAt: event.ModifiedOn || ''
      };
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error.message);
      throw error;
    }
  }

  async create(eventData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Transform application field names to database field names, only include Updateable fields
      const params = {
        records: [{
          Name: eventData.title || '',
          title_c: eventData.title || '',
          description_c: eventData.description || '',
          category_c: eventData.category || '',
          date_c: eventData.date || '',
          start_time_c: eventData.startTime || '',
          end_time_c: eventData.endTime || '',
          location_c: eventData.location || '',
          capacity_c: parseInt(eventData.capacity) || 0,
          image_url_c: eventData.imageUrl || '',
          is_featured_c: eventData.isFeatured || false,
          organizer_id_c: parseInt(eventData.organizerId) || 0
        }]
      };

      const response = await this.apperClient.createRecord('event_c', params);

      if (!response.success) {
        console.error("Failed to create event:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} events:`, failed);
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
          const createdEvent = successful[0].data;
          // Transform back to application field names
          return {
            Id: createdEvent.Id,
            title: createdEvent.title_c || '',
            description: createdEvent.description_c || '',
            category: createdEvent.category_c || '',
            date: createdEvent.date_c || '',
            startTime: createdEvent.start_time_c || '',
            endTime: createdEvent.end_time_c || '',
            location: createdEvent.location_c || '',
            capacity: createdEvent.capacity_c || 0,
            imageUrl: createdEvent.image_url_c || '',
            isFeatured: createdEvent.is_featured_c || false,
            organizerId: createdEvent.organizer_id_c || '',
            createdAt: createdEvent.CreatedOn || '',
            updatedAt: createdEvent.ModifiedOn || ''
          };
        }
      }

      throw new Error("No event created");
    } catch (error) {
      console.error("Error creating event:", error.message);
      throw error;
    }
  }

  async update(id, eventData) {
    try {
      if (!this.apperClient) this.initializeClient();

      // Transform application field names to database field names, only include Updateable fields
      const params = {
        records: [{
          Id: id,
          Name: eventData.title || '',
          title_c: eventData.title || '',
          description_c: eventData.description || '',
          category_c: eventData.category || '',
          date_c: eventData.date || '',
          start_time_c: eventData.startTime || '',
          end_time_c: eventData.endTime || '',
          location_c: eventData.location || '',
          capacity_c: parseInt(eventData.capacity) || 0,
          image_url_c: eventData.imageUrl || '',
          is_featured_c: eventData.isFeatured || false,
          organizer_id_c: parseInt(eventData.organizerId) || 0
        }]
      };

      const response = await this.apperClient.updateRecord('event_c', params);

      if (!response.success) {
        console.error("Failed to update event:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} events:`, failed);
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
          const updatedEvent = successful[0].data;
          // Transform back to application field names
          return {
            Id: updatedEvent.Id,
            title: updatedEvent.title_c || '',
            description: updatedEvent.description_c || '',
            category: updatedEvent.category_c || '',
            date: updatedEvent.date_c || '',
            startTime: updatedEvent.start_time_c || '',
            endTime: updatedEvent.end_time_c || '',
            location: updatedEvent.location_c || '',
            capacity: updatedEvent.capacity_c || 0,
            imageUrl: updatedEvent.image_url_c || '',
            isFeatured: updatedEvent.is_featured_c || false,
            organizerId: updatedEvent.organizer_id_c || '',
            createdAt: updatedEvent.CreatedOn || '',
            updatedAt: updatedEvent.ModifiedOn || ''
          };
        }
      }

      throw new Error("No event updated");
    } catch (error) {
      console.error("Error updating event:", error.message);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();

      const params = {
        RecordIds: [id]
      };

      const response = await this.apperClient.deleteRecord('event_c', params);

      if (!response.success) {
        console.error("Failed to delete event:", response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} events:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }

        return { success: successful.length > 0 };
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting event:", error.message);
      throw error;
    }
  }
}

export const eventService = new EventService();
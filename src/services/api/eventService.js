import mockEvents from "@/services/mockData/events.json";

class EventService {
  constructor() {
    this.events = [...mockEvents];
    this.nextId = Math.max(...this.events.map(event => event.Id)) + 1;
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 200));
  }

  async getAll() {
    await this.delay();
    return [...this.events];
  }

  async getById(id) {
    await this.delay();
    const event = this.events.find(event => event.Id === id);
    if (!event) {
      throw new Error("Event not found");
    }
    return { ...event };
  }

  async create(eventData) {
    await this.delay();
    const newEvent = {
      ...eventData,
      Id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.events.push(newEvent);
    return { ...newEvent };
  }

  async update(id, eventData) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    this.events[index] = {
      ...this.events[index],
      ...eventData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.events[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.events.findIndex(event => event.Id === id);
    if (index === -1) {
      throw new Error("Event not found");
    }
    
    this.events.splice(index, 1);
    return { success: true };
  }
}

export const eventService = new EventService();
// /events/eventBus.ts
type EventCallback = (data?: any) => void;

class EventBus {
  private events: { [key: string]: EventCallback[] } = {};

  on(event: string, callback: EventCallback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  emit(event: string, data?: any) {
    this.events[event]?.forEach(callback => callback(data));
  }

  off(event: string, callback: EventCallback) {
    this.events[event] = this.events[event]?.filter(cb => cb !== callback);
  }
}

export const eventBus = new EventBus();

class EventEmitter {
    constructor() {
      this.events = {};
    }
  
    on(event, listener) {
      if (!this.events[event]) {
        this.events[event] = [];
      }
      this.events[event].push(listener);
    }
  
    off(event, listenerToRemove) {
      if (!this.events[event]) return;
  
      this.events[event] = this.events[event].filter(
        (listener) => listener !== listenerToRemove
      );
    }
    removeAll(event, listenerToRemove) {
        if (!this.events[event]) return;
    
        this.events[event] = []
    }
  
    emit(event, data) {
      if (!this.events[event]) return;
  
      this.events[event].forEach((listener) => listener(data));
    }
  }
  
export const eventEmitter = new EventEmitter();
  
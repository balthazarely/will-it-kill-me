type ProgressListener = (data: ProgressUpdate) => void;

export interface ProgressUpdate {
  status: string;
  message: string;
}

class ProgressManager {
  private listeners: Map<string, Set<ProgressListener>> = new Map();
  private history: Map<string, ProgressUpdate[]> = new Map();

  subscribe(barcode: string, listener: ProgressListener): () => void {
    if (!this.listeners.has(barcode)) {
      this.listeners.set(barcode, new Set());
    }
    this.listeners.get(barcode)!.add(listener);

    // Send history to newly subscribed client
    const history = this.history.get(barcode) || [];
    history.forEach(listener);

    // Return unsubscribe function
    return () => {
      this.listeners.get(barcode)?.delete(listener);
    };
  }

  emit(barcode: string, update: ProgressUpdate) {
    // Store in history
    if (!this.history.has(barcode)) {
      this.history.set(barcode, []);
    }
    this.history.get(barcode)!.push(update);

    // Notify all listeners
    const listeners = this.listeners.get(barcode);
    if (listeners) {
      listeners.forEach((listener) => listener(update));
    }
  }

  clear(barcode: string) {
    this.listeners.delete(barcode);
    this.history.delete(barcode);
  }
}

export const progressManager = new ProgressManager();

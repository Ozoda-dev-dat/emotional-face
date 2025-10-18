// This application doesn't require backend storage
// All face analysis happens client-side using face-api.js

export interface IStorage {
  // No storage methods needed for this app
}

export class MemStorage implements IStorage {
  constructor() {
    // No initialization needed
  }
}

export const storage = new MemStorage();

import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT) 
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;

export const COLLECTIONS = {
  PROFILES: import.meta.env.VITE_APPWRITE_COLLECTION_PROFILES,     
  EXERCISES: import.meta.env.VITE_APPWRITE_COLLECTION_EXERCISES,            
  PRESET_MEALS: import.meta.env.VITE_APPWRITE_COLLECTION_PRESET_MEALS, 
  user_exercises: import.meta.env.VITE_APPWRITE_COLLECTION_USER_EXERCISES,     
  MEALS: import.meta.env.VITE_APPWRITE_COLLECTION_MEALS,            
  GOALS: import.meta.env.VITE_APPWRITE_COLLECTION_GOALS,            
  FRIENDSHIPS: import.meta.env.VITE_APPWRITE_COLLECTION_FRIENDSHIPS, 
  SOCIAL_FEED: import.meta.env.VITE_APPWRITE_COLLECTION_SOCIAL_FEED, 
  CALENDAR: import.meta.env.VITE_APPWRITE_COLLECTION_CALENDAR,
};

export { client };
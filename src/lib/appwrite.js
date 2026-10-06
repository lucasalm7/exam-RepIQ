import { Client, Account, Databases, Storage } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1') 
    .setProject('6aad3387000ccedb6341');

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = '6aad34a0001269f567d1';

export const COLLECTIONS = {
  PROFILES: '6aad463900322217e185',     
  EXERCISES: '6ab3a0fe0013114fc874',            
  PRESET_MEALS: '6aad4335002fb279ab1a', 
  user_exercises: '6aad35c30025bc2751a5',     
  MEALS: '6ab3a25f002d31fa699a',            
  GOALS: '6aad497d0008ecae7a30',            
  FRIENDSHIPS: '6aad4a02001afa9b3996', 
  SOCIAL_FEED: '6aad4a84000989965de1', 
};

export { client };
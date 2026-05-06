import { createMMKV } from 'react-native-mmkv';
import type { Persister } from '@tanstack/react-query-persist-client';

const storage = createMMKV({ id: 'query-client' });
const CACHE_KEY = 'tanstack-query-cache';

export const mmkvPersister: Persister = {
  persistClient: async client => {
    storage.set(CACHE_KEY, JSON.stringify(client));
  },
  restoreClient: async () => {
    const data = storage.getString(CACHE_KEY);
    if (!data) {
      return undefined;
    }
    return JSON.parse(data);
  },
  removeClient: async () => {
    storage.remove(CACHE_KEY);
  },
};

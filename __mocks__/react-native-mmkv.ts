function createMMKV() {
  const store = new Map<string, string | number | boolean>();
  return {
    id: 'mock',
    get length() {
      return store.size;
    },
    isReadOnly: false,
    isEncrypted: false,
    set: (key: string, value: string | number | boolean) => {
      store.set(key, value);
    },
    getString: (key: string): string | undefined => {
      const v = store.get(key);
      return typeof v === 'string' ? v : undefined;
    },
    getNumber: (key: string): number | undefined => {
      const v = store.get(key);
      return typeof v === 'number' ? v : undefined;
    },
    getBoolean: (key: string): boolean | undefined => {
      const v = store.get(key);
      return typeof v === 'boolean' ? v : undefined;
    },
    getBuffer: (_key: string) => undefined,
    contains: (key: string) => store.has(key),
    remove: (key: string) => store.delete(key),
    clearAll: () => store.clear(),
    getAllKeys: () => Array.from(store.keys()),
    addOnValueChangedListener: () => ({ remove: () => {} }),
    trim: () => {},
    recrypt: () => {},
    encrypt: () => {},
    decrypt: () => {},
    importAllFrom: () => 0,
    equals: () => false,
    dispose: () => {},
    name: 'MMKV' as const,
  };
}

export { createMMKV };

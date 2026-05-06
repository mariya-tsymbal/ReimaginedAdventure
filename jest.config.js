module.exports = {
  preset: '@react-native/jest-preset',
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
  setupFiles: [
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleNameMapper: {
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.ts',
    '^@shopify/flash-list$': '<rootDir>/__mocks__/@shopify/flash-list.tsx',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation|@shopify)/)',
  ],
};

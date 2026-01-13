// Fix: Remove missing type definition for 'vite/client' and incorrect global 'process' redeclaration.
// Augment the NodeJS.ProcessEnv interface to include API_KEY.

declare namespace NodeJS {
  interface ProcessEnv {
    API_KEY: string;
  }
}
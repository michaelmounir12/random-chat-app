import React from 'react';
import { AuthProvider } from './context';
import AppContent from './appScreen';

export default function App() {

  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}
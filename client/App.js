import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext, AuthProvider } from './context';

import AppContent from './appScreen';

export default function App() {

  return (
    <AuthProvider>
      <AppContent/>
    </AuthProvider>
  );
}
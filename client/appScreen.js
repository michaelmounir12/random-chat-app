import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext} from './context';
import { ActivityIndicator, View } from 'react-native';
import { HomeScreen } from './app-nav';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default  function AppContent() {
    const { isLoading,setIsLoading,setname,setimage } = useContext(AuthContext);
    useEffect(() => {
      const loadProfile = async () => {
        setIsLoading(true);
        const stored = await AsyncStorage.getItem('profile');
        if (stored) {
          try { const p = JSON.parse(stored); setname(p.name || ''); setimage(p.image || ''); } catch {}
        }
        setIsLoading(false);
      };
      loadProfile();
    }, []);
    if(isLoading){
      return ( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>)
    }
    const hasProfile = !!(typeof name === 'string' && name.trim().length > 0);
    return (
      <NavigationContainer>
        <HomeScreen initialRouteName={hasProfile ? 'Home' : 'Onboarding'} />
      </NavigationContainer>
    );
}
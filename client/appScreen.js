import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthContext} from './context';
import { ActivityIndicator, View } from 'react-native';
import {AuthScreen} from './auth-nav';
import { HomeScreen } from './app-nav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


export default  function AppContent() {
    const { isLoading,setIsLoading,setemail ,email,setname,setimage} = useContext(AuthContext);
     
    useEffect(() => {
      const fetchData = async () => {
        setIsLoading(true);
        const token = await AsyncStorage.getItem("token");
        if (token != null) {
          const response = await axios.post(`https://${process.env.SERVER_URL}/verify-jwt`, { token :token});
          if (response.status === 200) {
            setemail(response.data.email);
          
          }
        }
       
        setIsLoading(false);
      };
    
      fetchData();
    }, []);
   if(isLoading){
    return ( <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" />
  </View>)
   }
    return (
      <NavigationContainer>
        {email==""?<AuthScreen/>
        :<HomeScreen/>

        }
        
      </NavigationContainer>
    );
  }
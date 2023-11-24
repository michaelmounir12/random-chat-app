import React, { Component } from 'react'
import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import SignInPage from './screens/signInPage';
import LoginPage from './screens/login';
import ForgotPasswordPage from './screens/forgotpassword';
import resetPass from "./screens/resetpass"

const Stack = createStackNavigator();


export const AuthScreen = () => {
  
    return (
        <Stack.Navigator screenOptions={{ headerShown: false ,  ...TransitionPresets.SlideFromRightIOS}}>
              <Stack.Screen name="Login" component={LoginPage} />
              <Stack.Screen name="SignUp" component={SignInPage} />
              <Stack.Screen name="ForgotPassword" component={ForgotPasswordPage} />
              <Stack.Screen name="resetPass" component={resetPass} />
        </Stack.Navigator>

    )
  
}


import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Home from './screens/Home';
import Chat from './screens/chat';
import ChatsList from './screens/ChatsList';
import Onboarding from './screens/Onboarding';


const Stack = createStackNavigator();


export const  HomeScreen = () => {
  
    return (
        <Stack.Navigator screenOptions={{ headerShown: false ,  ...TransitionPresets.SlideFromRightIOS}}>
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Chats" component={ChatsList} />
              <Stack.Screen name="Chat" component={Chat} />

        </Stack.Navigator>

    )
  
}

import { createStackNavigator,TransitionPresets } from '@react-navigation/stack';
import Home from './screens/Home';
import Chat from './screens/chat';
import Profile from './screens/Profile';
import PairedComponent from './screens/pair';


const Stack = createStackNavigator();


export const  HomeScreen = () => {
  
    return (
        <Stack.Navigator screenOptions={{ headerShown: false ,  ...TransitionPresets.SlideFromRightIOS}}>
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Paired" component={PairedComponent} />
               <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="Chat" component={Chat} />

        </Stack.Navigator>

    )
  
}

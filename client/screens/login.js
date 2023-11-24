import {React,useState,useContext} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import { AuthContext } from '../context';


const LoginPage = ({navigation}) => {
  const {setIsLoading,setemail,setname} = useContext(AuthContext)
  const [email,emailfunc] = useState("");
  const [password,passfunc] = useState("");
  const [error,setError] = useState("");
  const handleLogin = async () => {
  try {
    
    // Make a POST request to the server to authenticate the user
    if(email =="" || password == ""){
      throw new Error("ENTER BOTH FIELDS");
    }
    setIsLoading(true)
    
    const response = await axios.post(`https://${process.env.SERVER_URL}/signin`, {
      email,
      password,
    });
    setIsLoading(false)
    if (response.status === 200) {
      const token = response.data.token;    
      await AsyncStorage.setItem('token', token);
      setname(response.data.name)

      setemail(email)
    } else {
      throw new Error("LOGIN FAILED CHECK CREDINTIALS")
    }
  } catch (error) {
    if (error.response) {
        
      setError(error.response.data); 
    } else if (error.request) {
    } else {
      setError(error.message)
    }
  }
};
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="black"
        onChange={(e)=>emailfunc(e.target.value)}
        onChangeText={()=>{setError("")}}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry
        onChange={(e)=>passfunc(e.target.value)}
        onChangeText={()=>{setError("")}}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
  <Text style={styles.buttonText}>Sign in</Text>
</TouchableOpacity>
      <Text style={styles.error}>
          {error}
      </Text>
      <TouchableOpacity style={styles.link} onPress={()=>{navigation.navigate('ForgotPassword')}}>
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.link} onPress={()=>{navigation.navigate('SignUp')}}>
        <Text style={styles.linkText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    backgroundColor: 'lightgray',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    alignSelf: 'center',
  },
  linkText: {
    color: 'black',
    textDecorationLine: 'underline',
  },
  error:{
    color:'red',
    marginTop: 10,
    alignSelf: 'center',
   
   
  },
});

export default LoginPage;
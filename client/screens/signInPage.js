import React,{useState,useContext} from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import * as Yup from 'yup';
import { AuthContext } from '../context';

const SignInPage = ({ navigation }) => {
  const {setIsLoading} = useContext(AuthContext)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
      
  
      const schema = Yup.object().shape({
        username: Yup.string().required('Username is required'),
        email: Yup.string().email('Invalid email').required('Email is required'),
        password: Yup.string().required('Password is required'),
      });
      try {
        if (password === '' || username === '' || email === '') {
          throw new Error("FILL MISSING FIELDS");
        }
        await schema.validate({ username, email, password });
        const res = await axios.post(`https://${process.env.SERVER_URL}/signup`, {
          name: username,
          email: email,
          password: password
        });
        navigation.navigate('Login')
      } catch (error) {
        if (error.response) {
        
          setError(error.response.data); 
        } else if (error.request) {
        } else {
          setError(error.message)
        }
      }
      

   



   
    setIsLoading(false)

  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="black"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="black"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="black"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign up</Text>
      </TouchableOpacity>
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity
        style={styles.link}
        onPress={() => {
          navigation.navigate('Login');
        }}
      >
        <Text style={styles.linkText}>Already have an account?</Text>
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

export default SignInPage;
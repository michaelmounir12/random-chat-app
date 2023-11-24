import React, { useState ,useContext} from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context';

const ResetPasswordPage = ({route,navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const {setIsLoading} = useContext(AuthContext)

  const [error, setError] = useState('');
  const {code,email} = route.params
  if(!code ||!email){
    return (
        <View style={styles2.container}>
          <Text style={styles2.invalidText}>Invalid Input</Text>
        </View>
      );
  }

  const handleResetPassword = async() => {
    try {
        if(password==""||confirmPassword=="") throw new Error("enter both fields")
        if (password === confirmPassword) {
            setIsLoading(true)
            const response = await axios.post(`https://${process.env.SERVER_URL}/resetpass`, {pass:password,
            email,code
          });
          setIsLoading(false)
          if(response.status==200){
            navigation.navigate("Login")
          }
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
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="black"
        secureTextEntry
        onChangeText={text => setPassword(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="black"
        secureTextEntry
        onChangeText={text => setConfirmPassword(text)}
      />
      <Text style={styles.error}>{error}</Text>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    height: 40,
    width: 300,
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    borderRadius: 5,
  },
  error: {
    color: 'red',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

const styles2 = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      invalidText: {
        fontSize: 36,
        color: 'red',
        fontWeight: 'bold',
      },
})

export default ResetPasswordPage;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';





const ForgotPasswordPage = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [error,seterror] = useState('')
  const [isEmailSent,setIsEmailSent] = useState(false)
  const [verificationCode, setVerificationCode] = useState('');
  const handleVerifyCode = async()=>{
    try {
      if(verificationCode =="") throw new Error("enter verify code")
       const response = await axios.post(`https://${process.env.SERVER_URL}/verify-code`, {code:verificationCode,
      email,
    });

     if(response.status ==200){
      navigation.navigate("resetPass",{code:verificationCode,email})
     }

    } catch (error) {
      if(error.response){
        seterror(error.response.data)
      }else
      seterror(error.message)
    }

  }

  const handleResetPassword = async() => {
   
    try {
      if(email =="") throw new Error("input email")
       const response = await axios.post(`https://${process.env.SERVER_URL}/reset-pass`, {
      email,
    });
      if(response.status ==200){
        setIsEmailSent(true)
      }
      

    } catch (error) {
      if(error.response){
        seterror(error.response.data)
      }else
      seterror(error.message)
    }
   
  };

  return (
    <View style={styles.container}>
      {isEmailSent ? (
        <View>
          <Text style={styles2.headerText}>Email Sent to {email}</Text>
          <TextInput
            style={styles2.input}
            placeholder="Verification Code"
            placeholderTextColor="black"
            onChangeText={text => setVerificationCode(text)}
          />
          <Text style={styles2.error}>{error}</Text>
          <TouchableOpacity style={styles2.submitButton} onPress={handleVerifyCode}>
            <Text style={styles2.buttonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.title}>Forgot Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="black"
            onChangeText={text => setEmail(text)}
          />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width:300,
    backgroundColor: 'lightgray',
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black',
    borderRadius: 5,

  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    padding:28
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error:{
    color:'red',
    marginTop: 10,
    alignSelf: 'center',
   
   
  },
  success:{
    color:'green',
    marginTop: 10,
    alignSelf: 'center',
   
   
  },
});
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
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
  submitButton: {
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

export default ForgotPasswordPage;
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context';
import { useEffect } from 'react';
import axios from "axios"

const Home = ({ navigation }) => {
  const { setIsLoading, email, name,setname,setimage } = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
    async function fetchData() {
      try {
        const res = await axios.post(`https://${process.env.SERVER_URL}/getNI`, { email });
        setimage(res.data.image);
        setname(res.data.name);
        setIsLoading(false); // If needed, set loading state to false
      } catch (error) {
        // Handle errors here
        console.error('Error fetching data:', error);
        setIsLoading(false); // Set loading state to false in case of an error
      }
    }
  
    fetchData();
  }, [email, setIsLoading, setimage, setname]);
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>{name}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Paired')}>
        <Text style={styles.buttonText}>Start Random Chat</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.buttonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  profileContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileText: {
    textAlign: 'center',
    color: '#333333',
    fontSize: 18,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: 'black',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Home;

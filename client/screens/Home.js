import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme';

const Home = ({ navigation }) => {
  const { setIsLoading, name,setname,setimage } = useContext(AuthContext);
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
    (async () => {
      const stored = await AsyncStorage.getItem('profile');
      if (stored) { try { const p = JSON.parse(stored); setname(p.name || ''); setimage(p.image || ''); } catch {} }
      setIsLoading(false);
    })();
  }, [setIsLoading, setimage, setname]);
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Text style={styles.profileText}>{name || 'Anonymous'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chats')}>
        <Text style={styles.buttonText}>Past Chats</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat')}>
        <Text style={styles.buttonText}>Start Random Chat</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  profileContainer: { backgroundColor: colors.surface, padding: 20, borderRadius: 10, marginBottom: 20 },
  profileText: { textAlign: 'center', color: colors.textPrimary, fontSize: 18 },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: { backgroundColor: colors.bubbleMe, paddingVertical: 15, paddingHorizontal: 25, borderRadius: 10, marginBottom: 20 },
});

export default Home;

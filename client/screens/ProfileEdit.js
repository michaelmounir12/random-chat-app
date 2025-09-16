import React, { useContext, useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context';
import { colors } from '../theme';

export default function ProfileEdit({ navigation }) {
  const { name, image, setname, setimage } = useContext(AuthContext);
  const [localName, setLocalName] = useState(name || '');
  const [photoUri, setPhotoUri] = useState(image || '');

  useEffect(() => { setLocalName(name || ''); setPhotoUri(image || ''); }, [name, image]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, aspect: [1,1], quality: 0.8 });
    if (!result.canceled) setPhotoUri(result.assets[0].uri);
  };

  const save = async () => {
    const profile = { name: localName.trim(), image: photoUri };
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    setname(profile.name);
    setimage(profile.image);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <TouchableOpacity style={styles.avatar} onPress={pickImage}>
        {photoUri ? <Image source={{ uri: photoUri }} style={styles.avatarImg} /> : <Text style={styles.avatarText}>Pick Photo</Text>}
      </TouchableOpacity>
      <TextInput value={localName} onChangeText={setLocalName} placeholder="Your name" placeholderTextColor={colors.textSecondary} style={styles.input} />
      <TouchableOpacity onPress={save} style={styles.button}><Text style={styles.buttonText}>Save</Text></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 24 },
  title: { color: colors.textPrimary, fontSize: 22, marginBottom: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  avatarImg: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { color: colors.textSecondary },
  input: { width: '100%', borderWidth: 1, borderColor: colors.surfaceAlt2, color: colors.textPrimary, padding: 12, borderRadius: 10, marginBottom: 16, backgroundColor: colors.surface },
  button: { backgroundColor: colors.bubbleMe, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' }
});



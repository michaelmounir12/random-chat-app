import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../context';
import { colors } from '../theme';

export default function Onboarding({ navigation }) {
  const { setname, setimage } = useContext(AuthContext);
  const [localName, setLocalName] = useState('');
  const [photoUri, setPhotoUri] = useState('');

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });
    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const save = async () => {
    const profile = { name: localName.trim(), image: photoUri };
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
    setname(profile.name);
    setimage(profile.image);
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
  };

  const canSave = localName.trim().length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <TouchableOpacity style={styles.avatar} onPress={pickImage}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.avatarImg} />
        ) : (
          <Text style={styles.avatarText}>Pick Photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        placeholder="Enter your name"
        placeholderTextColor={colors.textSecondary}
        value={localName}
        onChangeText={setLocalName}
        style={styles.input}
      />
      <TouchableOpacity disabled={!canSave} onPress={save} style={[styles.button, !canSave && styles.buttonDisabled]}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', padding: 24 },
  title: { color: colors.textPrimary, fontSize: 24, marginBottom: 24 },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surfaceAlt, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  avatarImg: { width: 120, height: 120, borderRadius: 60 },
  avatarText: { color: colors.textSecondary },
  input: { width: '100%', borderWidth: 1, borderColor: colors.surfaceAlt2, color: colors.textPrimary, padding: 12, borderRadius: 10, marginBottom: 16, backgroundColor: colors.surface },
  button: { backgroundColor: colors.bubbleMe, paddingVertical: 14, paddingHorizontal: 24, borderRadius: 10, width: '100%', alignItems: 'center' },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontWeight: '600' }
});



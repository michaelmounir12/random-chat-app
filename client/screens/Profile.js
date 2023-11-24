import React, { useState ,useContext,useEffect} from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet ,Text} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';


const Profile = () => {
  const [name, setName] = useState('');
  const {setIsLoading,setemail,image,setimage,setname,email,} = useContext(AuthContext)
  const [error,setError] = useState("");


  useEffect(() => {
    
   
   
   
  }, []);

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    if (!result.cancelled) {

      setimage(result.uri);
    }
  };
  

  const handleSaveProfile = async() => {
    try {
    
      const token = await AsyncStorage.getItem("token");
    const response = await axios.post(`https://${process.env.SERVER_URL}/saveprofile`, {
      email,
      imageuri:image?image:"",
      name,
      token
    });
    } catch (error) {
      if(error.response){
          setError(error.response.data)
      }
      else{
        setError(error.message)
      }
    }
    
  };
  const handleDeletePhoto = async() => {
    try {
      setimage(null)
      const token = await AsyncStorage.getItem("token");
    const response = await axios.post('https://${process.env.SERVER_URL}/deletephoto', {
      email,
      token
    });
    } catch (error) {
      if(error.response){
        setError(error.response.data)
    }
    else{
      setError(error.message)
    }
    }
    
  };
  const handleLogout =async () => {
    await AsyncStorage.removeItem("token");
    setemail("");
    setname("")
  };

  return (
    <View style={styles.container}>
      <View style={styles.profilePhotoContainer}>
      {image ? (
          <Image source={{ uri: image }} style={styles.profilePhoto} />
        ) : (
          <Image source={require("../assets/photo.png")} style={styles.profilePhoto} /> )}
          {image&& (
          <TouchableOpacity style={styles.deletePhotoIcon} onPress={handleDeletePhoto}>
            <Ionicons name="ios-trash" size={24} color="white" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.changePhotoIcon} onPress={handlePickImage}>
        <Ionicons name="ios-add" size={24} color="white" />
      </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="change your name"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      <Text style={styles.error}>
          {error}
      </Text>
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
  profilePhotoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  changePhotoIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'black',
    borderRadius: 15,
    padding: 5,
  },
  input: {
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
    color: 'black',
  },
  saveButton: {
    backgroundColor: 'black',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  logoutButton: {
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
  deletePhotoIcon: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'red',
    borderRadius: 15,
    padding: 5,
  },
  error:{
    color:'red',
    marginTop: 10,
    alignSelf: 'center',
   
   
  },
});

export default Profile;
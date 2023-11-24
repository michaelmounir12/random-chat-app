import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Image, StyleSheet, Text, FlatList, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context';
import * as ImagePicker from 'expo-image-picker';


const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [fname,setfname] = useState("")
  const {  ws,  room, name } = useContext(AuthContext);
  ws.send(JSON.stringify({ content: JSON.stringify({ name: name, room: room }) }))
  useEffect(()=>{
   
   
    
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ content: JSON.stringify({ disconnect: "true", room: room }) }))
        ws.close();
      }
    };
  },[])
  const handleSendMessage = () => {
    const newMessage = {
      content: message,
      sentByUser: true,
      isImage:false // Flag to identify user-sent messages
    };
    if(message !="")
    {
       ws.send(JSON.stringify({ content: JSON.stringify({ message: message, room: room }) }));
    setMessages([...messages, newMessage]);
    }
   
    setMessage(''); // Clear input after sending message
  };

  ws.onmessage = (e) => {
    const receivedMessage = JSON.parse(e.data);
    if(receivedMessage.name){
      setfname(receivedMessage.name)
    }
    if (receivedMessage.message) {
      const newFriendMessage = {
        content: receivedMessage.message,
        sentByUser: false, // Friend-sent messages
        isImage:false
      };
      setMessages([...messages, newFriendMessage]);
    }
    if (receivedMessage.image) {
      const newFriendMessage = {
        content: receivedMessage.image,
        sentByUser: false ,
        isImage: true,
        // Friend-sent messages
      };
      setMessages([...messages, newFriendMessage]);
    }
  };

  const handlePhotoSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    
    if (!result.cancelled) {
      const newMessage = {
        content: result.assets[0].uri, // Store the image URI as message content
        sentByUser: true,
        isImage: true, // Flag to identify image messages
      };
      ws.send(JSON.stringify({ content: JSON.stringify({ image:  result.assets[0].uri, room: room }) }));
      setMessages([...messages, newMessage]);
    }
  };



  const renderItem = ({ item }) => {
    if (item.isImage) {
      // Render the image message
      return (
        <View style={item.sentByUser ? styles.userMessage : styles.friendMessage}>
          <Image source={{ uri: item.content }} style={{ width: 200, height: 200, borderRadius: 8 }} />
        </View>
      );
    } else {
      // Render text message
      return (
        <View style={item.sentByUser ? styles.userMessage : styles.friendMessage}>
          <Text style={styles.messageText}>{item.content}</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.profileContainer}>
        
          <Text style={styles.profileName}>{fname}</Text>
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={styles.messageContainer} behavior="padding">
        <FlatList
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.chatMessages}
        />
        <View style={styles.bottomBar}>
          <TouchableOpacity onPress={handlePhotoSelection} style={styles.photoIconContainer} >
            <Ionicons name="ios-camera" size={24} color="white" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity style={styles.sendIconContainer} onPress={handleSendMessage}>
            <Ionicons name="ios-send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topBar: {
    backgroundColor: 'black',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  profileName: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageContainer: {
    flex: 1,
  },
  chatMessages: {
    padding: 10,
  },
  bottomBar: {
    backgroundColor: 'black',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  photoIconContainer: {
    marginRight: 10,
  },
  sendIconContainer: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 5,
    padding: 10,
    color: 'white',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%', // Adjust as needed
  },
  friendMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'pink',
    padding: 10,
    borderRadius: 8,
    marginBottom: 8,
    maxWidth: '70%', // Adjust as needed
  },
  messageText: {
    color: 'white',
  },
});

export default Chat;

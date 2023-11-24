import { useContext } from 'react';
import React from 'react';
import { View, Image, Text, StyleSheet  } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { AuthContext } from '../context';
import { useEffect } from 'react';
import { useState } from 'react';

const PairedComponent=({navigation})=> {
   
    const {setws,email,setroom,room,name,image} = useContext(AuthContext)
    useEffect(() => {
      const ws = new WebSocket(`ws://${process.env.SERVER_URL}/chat`);
      setws(ws);
    
      ws.onopen = () => {
        
      };
    
      ws.onmessage = (e) => {
        const msg = JSON.parse(e.data) ;
        if(msg.status == "paired"){
          setroom(msg.room)
            navigation.navigate('Chat')
  
        }
      };
      
    
     
    }, []);
   


   
    return (
      <View style={styles.container}>
         
           <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
           <Spinner
             visible={!room}
             textContent={'Loading...'} 
             textStyle={{ color: 'black' }} 
             color={'black'} 
             animation={'fade'} 
             overlayColor={'white'} 
             size={'small'} 
           />
         </View>
         </View>
    );
    }


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  pairedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  personContainer: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  grayscaleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    resizeMode: 'cover',
    filter: 'grayscale(100%)',
  },
  personName: {
    color: 'black',
    marginTop: 10,
  },
});

export default PairedComponent;

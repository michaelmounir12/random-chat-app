import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { loadRoomsWithLastMessage } from '../db';
import { colors } from '../theme';

export default function ChatsList({ navigation }) {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    loadRoomsWithLastMessage().then(setRooms).catch(() => {});
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Chat', { room: item.room })}>
      {item.peerImage ? <Image source={{ uri: item.peerImage }} style={styles.avatar} /> : <View style={styles.avatarFallback}><Text style={styles.avatarLetter}>{(item.peerName || 'U')[0]}</Text></View>}
      <View style={styles.itemContent}>
        <Text style={styles.room}>{item.peerName || item.room}</Text>
        {item.lastMessage ? <Text style={styles.preview} numberOfLines={1}>{item.lastMessage}</Text> : null}
        {item.lastAt ? <Text style={styles.time}>{new Date(item.lastAt).toLocaleString()}</Text> : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList data={rooms} renderItem={renderItem} keyExtractor={(it, idx) => it.room + String(idx)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 12 },
  item: { backgroundColor: colors.surface, borderRadius: 12, padding: 12, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  itemContent: { marginLeft: 12, flex: 1 },
  room: { color: colors.textPrimary, fontSize: 16, marginBottom: 4 },
  preview: { color: colors.textSecondary },
  time: { color: colors.textMuted, marginTop: 6, fontSize: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22 },
  avatarFallback: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surfaceAlt2, alignItems: 'center', justifyContent: 'center' },
  avatarLetter: { color: colors.textSecondary, fontWeight: '700' }
});



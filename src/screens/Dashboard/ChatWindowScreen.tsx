import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useSelector } from 'react-redux';

// Interface matching the explicit API payload structure
export interface APIChatMessage {
  _id: string;
  convId: string;
  sender_type: 'user' | 'expert';
  sender_id: string;
  sender_details: { name: string };
  receiver_id: string;
  receiver_detail: { name: string };
  message: string;
  read_receipt: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatWindowProps {
  route?: {
    params?: {
      conversationId: string;
      title: string;
    };
  };
}

const ChatWindowScreen: React.FC<ChatWindowProps> = ({ route }) => {
  const chatTitle = route?.params?.title || 'Chat';
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useSelector((state: any) => state.auth.user);
  const currentUserId = user?.id || '';

  const [messages, setMessages] = useState<APIChatMessage[]>([
    {
      "_id": "69c2d81e7c25e0a8de5f5a6c",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "expert",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "qwert",
      "read_receipt": true,
      "timestamp": "2026-03-24T18:29:50.884Z",
      "createdAt": "2026-03-24T18:29:50.885Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2d6bd7c25e0a8de5f5a57",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "expert",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "Okay",
      "read_receipt": true,
      "timestamp": "2026-03-24T18:23:57.234Z",
      "createdAt": "2026-03-24T18:23:57.242Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2d64a41a8efa11e4359b4",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "expert",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "OKAY",
      "read_receipt": true,
      "timestamp": "2026-03-24T18:22:02.270Z",
      "createdAt": "2026-03-24T18:22:02.283Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2d5294700fea0905b08fd",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "user",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "okay",
      "read_receipt": true,
      "timestamp": "2026-03-24T18:17:13.005Z",
      "createdAt": "2026-03-24T18:17:13.008Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2d4634700fea0905b08ea",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "user",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "okay",
      "read_receipt": true,
      "timestamp": "2026-03-24T18:13:55.086Z",
      "createdAt": "2026-03-24T18:13:55.092Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2cdcc0880016bb764a4f9",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69b501b30bf27cfdc02d751c",
      "sender_type": "user",
      "sender_details": { "name": "homie_0xpjydnzf" },
      "receiver_id": "69c2c1fa9896ad9d1a5e90d5",
      "receiver_detail": { "name": "homie_ppjsfnqpp" },
      "message": "I've been feeling a bit dizzy lately.",
      "read_receipt": true,
      "timestamp": "2026-03-24T17:12:28.381Z",
      "createdAt": "2026-03-24T17:45:48.385Z",
      "updatedAt": "2026-03-24T17:46:28.071Z"
    },
    {
      "_id": "69c2cdcc0880016bb764a4f8",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69c2c1fa9896ad9d1a5e90d5",
      "sender_type": "user",
      "sender_details": { "name": "homie_ppjsfnqpp" },
      "receiver_id": "69b501b30bf27cfdc02d751c",
      "receiver_detail": { "name": "homie_0xpjydnzf" },
      "message": "Hi! I'm here to help. What seems to be the problem?",
      "read_receipt": true,
      "timestamp": "2026-03-24T16:55:48.381Z",
      "createdAt": "2026-03-24T17:45:48.385Z",
      "updatedAt": "2026-03-25T17:58:11.057Z"
    },
    {
      "_id": "69c2c9b321bd10923d709948",
      "convId": "69c2c9b31df2c50346082cb1",
      "sender_id": "69b501b30bf27cfdc02d751c",
      "sender_type": "user",
      "sender_details": { "name": "homie_0xpjydnzf" },
      "receiver_id": "69c2c1fa9896ad9d1a5e90d5",
      "receiver_detail": { "name": "homie_ppjsfnqpp" },
      "message": "I've been feeling a bit dizzy lately.",
      "read_receipt": true,
      "timestamp": "2026-03-24T16:54:59.311Z",
      "createdAt": "2026-03-24T17:28:19.316Z",
      "updatedAt": "2026-03-24T17:46:28.071Z"
    }
  ]);

  const [inputText, setInputText] = useState('');

  const formatTime = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const currentTimeISO = new Date().toISOString();
    const newLocalMsg: APIChatMessage = {
      _id: Date.now().toString(),
      convId: "69c2c9b31df2c50346082cb1",
      sender_type: 'user',
      sender_id: currentUserId,
      sender_details: { name: 'Me' },
      receiver_id: '69c2c1fa9896ad9d1a5e90d5',
      receiver_detail: { name: chatTitle },
      message: inputText.trim(),
      read_receipt: false,
      timestamp: currentTimeISO,
      createdAt: currentTimeISO,
      updatedAt: currentTimeISO,
    };

    setMessages(prev => [newLocalMsg, ...prev]);
    setInputText('');
  };

  const renderMessageLeaf = ({ item }: { item: APIChatMessage }) => {
    const isMe = item.sender_id === currentUserId;

    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.myWrapper : styles.theirWrapper]}>
        <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
          <Text style={styles.bubbleText}>{item.message}</Text>
          <Text style={[styles.timestampText, isMe ? styles.myTimestamp : styles.theirTimestamp]}>
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {chatTitle}
          </Text>
          <View style={styles.placeholderBlock} />
        </View>

        <FlatList
          data={messages}
          renderItem={renderMessageLeaf}
          keyExtractor={item => item._id}
          inverted
          contentContainerStyle={styles.messageListContent}
        />

        {/* Using standard SafeAreaView edges bottom handling only inside the layout boundary */}
        <SafeAreaView edges={['bottom']} style={styles.inputBarContainer}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              placeholder="Type a message..."
              placeholderTextColor="#8E8E93"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.disabledSend]}
              onPress={handleSendMessage}
              disabled={!inputText.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default ChatWindowScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black || '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  placeholderBlock: {
    width: 32,
  },
  keyboardContainer: {
    flex: 1,
    backgroundColor: colors.black || '#000000',
  },
  messageListContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  myWrapper: {
    justifyContent: 'flex-end',
  },
  theirWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
  },
  myBubble: {
    backgroundColor: colors.primary || '#FF6B00',
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    backgroundColor: '#2C2C2E',
    borderBottomLeftRadius: 4,
  },
  bubbleText: {
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 20,
  },
  timestampText: {
    fontSize: 10,
    textAlign: 'right',
    marginTop: 4,
  },
  myTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  theirTimestamp: {
    color: '#8E8E93',
  },
  inputBarContainer: {
    backgroundColor: '#1C1C1E',
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputField: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    color: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    fontSize: 15,
  },
  sendButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  disabledSend: {
    opacity: 0.4,
  },
  sendButtonText: {
    color: colors.primary || '#FF6B00',
    fontWeight: '700',
    fontSize: 16,
  },
});
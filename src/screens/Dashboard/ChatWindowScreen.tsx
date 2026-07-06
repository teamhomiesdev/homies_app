import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useSelector } from 'react-redux';
import { chatService } from '../../services/chatService';
import socketService from '../../services/socketService';

export interface APIChatMessage {
  _id: string;
  convId: string;
  sender_type: 'user' | 'expert';
  sender_id: string;
  sender_details: { id: string; name: string };
  receiver_id: string;
  receiver_detail: { id: string; name: string };
  message: string;
  read_receipt: boolean;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface NewMessagePayload {
  convId: string;
  sender_id: string;
  sender_type: 'user' | 'expert';
  sender_details: { id: string; name: string };
  receiver_id: string;
  receiver_detail: { id: string; name: string };
  message: string;
  timestamp: string;
}

interface ChatWindowProps {
  route?: {
    params?: {
      conversationId: string;
      title: string;
      expertId?: string;
      fromTab?: 'Experts' | 'Conversations';
      initialStatus?: string;
    };
  };
}

const ChatWindowScreen: React.FC<ChatWindowProps> = ({ route }) => {
  const initialConvId = route?.params?.conversationId || '';
  const chatTitle = route?.params?.title || 'Chat';
  const initialExpertId = route?.params?.expertId || '';
  const fromTab = route?.params?.fromTab || 'Conversations';
  
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useSelector((state: any) => state.auth.user);
  const currentUserId = user?.id || '';
  const currentUserName = user?.firstName || 'Me';

  const [conversationId, setConversationId] = useState<string>(initialConvId);
  const [expertId, setExpertId] = useState<string>(initialExpertId);
  const [messages, setMessages] = useState<APIChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState<boolean>(false);
  const [inputText, setInputText] = useState('');
  
  const hasInitialized = useRef(false);

  const formatTime = (isoString?: string): string => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    } catch {
      return '';
    }
  };

  useEffect(() => {
    const initializeChatContext = async () => {
      if (hasInitialized.current) return;
      hasInitialized.current = true;

      if (fromTab === 'Conversations' && initialConvId) {
        await loadChatHistory(initialConvId);
      } else if (fromTab === 'Experts' && initialExpertId) {
        try {
          setHistoryLoading(true);
          const response = await chatService.createConversation({ expertId: initialExpertId });
          const generatedConvId = response?.data?._id;
          const assignedExpertId = response?.data?.expert_id || initialExpertId;

          if (generatedConvId) {
            setConversationId(generatedConvId);
            setExpertId(assignedExpertId);
            await loadChatHistory(generatedConvId);
          }
        } catch (err) {
          console.error('Error creating chat context channel:', err);
          hasInitialized.current = false;
        } finally {
          setHistoryLoading(false);
        }
      }
    };

    initializeChatContext();

    return () => {
      hasInitialized.current = false;
    };
  }, [fromTab, initialConvId, initialExpertId]);

  const loadChatHistory = async (targetConvId: string) => {
    try {
      setHistoryLoading(true);
      const response = await chatService.getConversationMessages(targetConvId);
      if (response?.success && Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (err) {
      console.error('Failed fetching historic chat threads:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    const socket = socketService.socket;
    if (!socket || !conversationId) return;

    socket.emit('join_chat', conversationId);

    const anyListener = (event: string, ...args: any[]) => {
      console.log(`Socket Event Received: ${event}`, args);
      const payload = args[0];
      if (!payload) return;

      if (event === 'receive_message') {
        const msg = payload as APIChatMessage;
        if (msg.convId === conversationId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m._id === msg._id || (m.timestamp === msg.timestamp && m.message === msg.message));
            if (exists) return prev;
            return [msg, ...prev];
          });
        }
      }

      if (event === 'message:new') {
        const data = payload as NewMessagePayload;
        if (data.convId === conversationId) {
          setMessages((prev) => {
            const exists = prev.some((m) => m.timestamp === data.timestamp && m.message === data.message);
            if (exists) return prev;

            const structuredMessage: APIChatMessage = {
              _id: Date.now().toString(),
              convId: data.convId,
              sender_id: data.sender_id,
              sender_type: data.sender_type,
              sender_details: data.sender_details,
              receiver_id: data.receiver_id,
              receiver_detail: data.receiver_detail,
              message: data.message,
              read_receipt: false,
              timestamp: data.timestamp,
              createdAt: data.timestamp,
              updatedAt: data.timestamp,
            };
            return [structuredMessage, ...prev];
          });
        }
      }
    };

    socket.onAny(anyListener);

    return () => {
      socket.offAny(anyListener);
      socket.emit('leave_room', { conversationId });
    };
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !conversationId) return;

    const messagePayload = {
      convId: conversationId,
      message: inputText.trim(),
      receiver_id: expertId,
      sender_id: currentUserId,
      sender_details: { id: currentUserId, name: currentUserName },
      receiver_detail: { id: expertId, name: chatTitle }
    };

    if (socketService.socket) {
      socketService.socket.emit('send_message', messagePayload);
    }

    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.keyboardContainer}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backButtonText}>✕</Text>
          </TouchableOpacity>
          <View style={styles.titleWrapper}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {chatTitle}
            </Text>
          </View>
          <View style={styles.placeholderBlock} />
        </View>

        {historyLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color={colors.primary || '#FF6B00'} />
          </View>
        ) : (
          <FlatList
            data={messages}
            renderItem={({ item }) => {
              const isMe = item.sender_id === currentUserId;
              const displayTime = formatTime(item.timestamp || item.createdAt);
              
              return (
                <View style={[styles.bubbleWrapper, isMe ? styles.myWrapper : styles.theirWrapper]}>
                  <View style={[styles.bubbleContainer, isMe ? styles.myAlign : styles.theirAlign]}>
                    <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                      <Text style={styles.bubbleText}>{item.message}</Text>
                    </View>
                    {displayTime ? (
                      <Text style={[styles.timestampText, isMe ? styles.myTimestamp : styles.theirTimestamp]}>
                        {displayTime}
                      </Text>
                    ) : null}
                  </View>
                </View>
              );
            }}
            keyExtractor={(item) => item._id}
            inverted
            contentContainerStyle={styles.messageListContent}
          />
        )}

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
              style={[styles.sendButton, (!inputText.trim() || !conversationId) && styles.disabledSend]}
              onPress={handleSendMessage}
              disabled={!inputText.trim() || !conversationId}
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
  container: { flex: 1, backgroundColor: colors.black || '#000000' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: '#1C1C1E' },
  backButton: { width: 32, height: 32, justifyContent: 'center' },
  backButtonText: { color: '#FFFFFF', fontSize: 24, fontWeight: '300' },
  titleWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', textAlign: 'center', letterSpacing: -0.3 },
  placeholderBlock: { width: 32 },
  keyboardContainer: { flex: 1, backgroundColor: colors.black || '#000000' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  messageListContent: { paddingHorizontal: 16, paddingVertical: 16 },
  bubbleWrapper: { flexDirection: 'row', marginBottom: 14, width: '100%' },
  myWrapper: { justifyContent: 'flex-end' },
  theirWrapper: { justifyContent: 'flex-start' },
  bubbleContainer: { maxWidth: '78%' },
  myAlign: { alignItems: 'flex-end' },
  theirAlign: { alignItems: 'flex-start' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20 },
  myBubble: { backgroundColor: colors.primary || '#FF6B00', borderBottomRightRadius: 4 },
  theirBubble: { backgroundColor: '#2C2C2E', borderBottomLeftRadius: 4 },
  bubbleText: { color: '#FFFFFF', fontSize: 15, lineHeight: 20 },
  timestampText: { fontSize: 11, color: '#8E8E93', marginTop: 3 },
  myTimestamp: { marginRight: 4 },
  theirTimestamp: { marginLeft: 4 },
  inputBarContainer: { backgroundColor: '#1C1C1E', borderTopWidth: 1, borderTopColor: '#2C2C2E' },
  inputBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10 },
  inputField: { flex: 1, backgroundColor: '#2C2C2E', color: '#FFFFFF', borderRadius: 22, paddingHorizontal: 16, paddingVertical: 8, maxHeight: 100, fontSize: 15 },
  sendButton: { marginLeft: 12, paddingHorizontal: 12, paddingVertical: 8 },
  disabledSend: { opacity: 0.4 },
  sendButtonText: { color: colors.primary || '#FF6B00', fontWeight: '700', fontSize: 16 },
});
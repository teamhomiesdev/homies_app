import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ListRenderItemInfo,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../theme/colors';
import { useSelector } from 'react-redux';
import {
  getExpertsList,
  getConversationsList,
} from '../../services/userService';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';

export type TabType = 'Experts' | 'Conversations';

export interface ExpertItem {
  id: string;
  homiesId: string;
  status: string;
  name: string;
  email: string;
}

export interface ConversationItem {
  _id: string;
  expert_id: { _id: string; homiesId: string; status: string };
  user_id: {
    _id: string;
    firstName?: string;
    homiesId: string;
    status: string;
  };
  lastMessage?: { message: string; createdAt: string };
}

const ChatScreen: React.FC = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const user = useSelector((state: any) => state.auth.user);
  const helps = user?.helps?.[0] || '';
  const [activeTab, setActiveTab] = useState<TabType>('Experts');

  const [experts, setExperts] = useState<ExpertItem[]>([]);
  const [expertPage, setExpertPage] = useState<number>(1);
  const [expertLoading, setExpertLoading] = useState<boolean>(false);
  const [hasMoreExperts, setHasMoreExperts] = useState<boolean>(true);

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [convPage, setConvPage] = useState<number>(1);
  const [convLoading, setConvLoading] = useState<boolean>(false);
  const [hasMoreConvs, setHasMoreConvs] = useState<boolean>(true);

  const fetchExpertsFromApi = useCallback(
    async (page: number, currentCategory: string) => {
      if (expertLoading && page !== 1) return;
      setExpertLoading(true);
      try {
        const response = await getExpertsList(page, currentCategory);
        if (response?.success && response?.data) {
          const fetchedList = response.data.list || [];
          const meta = response.data.pageMeta;
          setExperts(prev =>
            page === 1 ? fetchedList : [...prev, ...fetchedList],
          );
          setHasMoreExperts(
            meta ? meta.page < meta.pages : fetchedList.length >= 10,
          );
        }
      } catch (e) {
        console.error(e);
      } finally {
        setExpertLoading(false);
      }
    },
    [expertLoading],
  );

  const fetchConversationsFromApi = useCallback(
    async (page: number) => {
      if (convLoading && page !== 1) return;
      setConvLoading(true);
      try {
        const response = await getConversationsList(page);
        if (response?.success && response?.data) {
          const fetchedList = response.data.conversations || [];
          setConversations(prev =>
            page === 1 ? fetchedList : [...prev, ...fetchedList],
          );
          setHasMoreConvs(response.data.currentPage < response.data.totalPages);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setConvLoading(false);
      }
    },
    [convLoading],
  );

  useEffect(() => {
    if (activeTab === 'Experts') {
      setExperts([]);
      setExpertPage(1);
      if (helps) fetchExpertsFromApi(1, helps);
    } else {
      setConversations([]);
      setConvPage(1);
      fetchConversationsFromApi(1);
    }
  }, [activeTab, helps]);

  const loadMoreData = () => {
    if (activeTab === 'Experts' && !expertLoading && hasMoreExperts) {
      setExpertPage(prev => prev + 1);
      fetchExpertsFromApi(expertPage + 1, helps);
    } else if (activeTab === 'Conversations' && !convLoading && hasMoreConvs) {
      setConvPage(prev => prev + 1);
      fetchConversationsFromApi(convPage + 1);
    }
  };

  const openChat = (item: ExpertItem | ConversationItem) => {
    const isConv = activeTab === 'Conversations';

    // Resolve safe metadata identifiers to navigate with
    const conversationId = isConv
      ? (item as ConversationItem)._id
      : (item as ExpertItem).id;
    const chatTitle = isConv
      ? (item as ConversationItem).user_id?.firstName ||
        (item as ConversationItem).user_id?.homiesId ||
        'Homie'
      : (item as ExpertItem).name || 'Expert';

    // Route transitions to ChatWindow carrying properties forward
    navigation.navigate('ChatWindow', {
      conversationId,
      title: chatTitle,
    });
  };

  const renderItem = ({
    item,
  }: ListRenderItemInfo<ExpertItem | ConversationItem>) => {
    const isConv = activeTab === 'Conversations';
    const name = isConv
      ? (item as ConversationItem).user_id?.firstName ||
        (item as ConversationItem).user_id?.homiesId ||
        'Homie'
      : (item as ExpertItem).name || 'Expert';
    const subText = isConv
      ? (item as ConversationItem).lastMessage?.message
      : (item as ExpertItem).email;
    const status = isConv
      ? (item as ConversationItem).user_id?.status
      : (item as ExpertItem).status;

    return (
      <TouchableOpacity style={styles.itemRow} onPress={() => openChat(item)}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {name.slice(0, 2).toUpperCase()}
          </Text>
          <View
            style={[
              styles.statusDot,
              status === 'online' ? styles.onlineDot : styles.offlineDot,
            ]}
          />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.nameText} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.subText} numberOfLines={1}>
            {subText || 'No messages yet'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
      <View style={styles.tabContainer}>
        {(['Experts', 'Conversations'] as TabType[]).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTabButton,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={activeTab === 'Experts' ? experts : conversations}
        keyExtractor={item => ('id' in item ? item.id : item._id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() =>
          expertLoading || convLoading ? (
            <ActivityIndicator style={styles.loader} color={colors.primary} />
          ) : null
        }
        ListEmptyComponent={() =>
          !expertLoading && !convLoading ? (
            <Text style={styles.emptyText}>No items found</Text>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.black || '#000000' },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    backgroundColor: colors.black_1 || '#121212',
    borderRadius: 12,
    padding: 4,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTabButton: { backgroundColor: colors.primary || '#FF6B00' },
  tabText: {
    color: colors.gray_1 || '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
  activeTabText: { color: colors.white || '#FFFFFF', fontWeight: '700' },
  listContent: { paddingHorizontal: 16, paddingTop: 8 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#3A3A3C',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: colors.white || '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#1C1C1E',
  },
  onlineDot: { backgroundColor: '#4CD964' },
  offlineDot: { backgroundColor: '#8E8E93' },
  infoContainer: { flex: 1, marginLeft: 14, justifyContent: 'center' },
  nameText: {
    color: colors.white || '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  subText: { color: colors.gray_1 || '#8E8E93', fontSize: 13 },
  loader: { paddingVertical: 16, alignItems: 'center' },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
  },
});

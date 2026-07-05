import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import PostCard, { PostData } from '../../components/PostCard/PostCard';
import { postService } from '../../services/postService';

const SocialScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [posts, setPosts] = useState<PostData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  
  // Pagination Tracking States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Track which post is currently focused in the center of the screen for video autoplay
  const [activeVideoPostId, setActiveVideoPostId] = useState<string | null>(null);

  // useFocusEffect fires every single time the screen gains active user focus
  useFocusEffect(
    useCallback(() => {
      // Reset tracking pagination states and fetch fresh starting page data
      fetchSocialPosts(1, true);
    }, [])
  );

  const fetchSocialPosts = async (pageToFetch: number, isInitialRefresh: boolean = false) => {
    // Prevent duplicated parallel page execution sweeps
    if (loading || loadingMore) return;

    try {
      if (isInitialRefresh) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      // Explicitly passing 'SOCIAL' type to the api post service
      const json = await postService.getPosts(pageToFetch, 10, 'SOCIAL');

      if (json && json.success && json.data?.posts) {
        if (isInitialRefresh) {
          setPosts(json.data.posts);
          setCurrentPage(1);
        } else {
          // Append new paginated items to the existing feed array
          setPosts((prevPosts) => [...prevPosts, ...json.data.posts]);
          setCurrentPage(pageToFetch);
        }
        
        // Dynamically capture total page boundaries delivered by the server backend
        setTotalPages(json.data.pages || 1);
      } else {
        Alert.alert('Error', json.message || 'Failed to retrieve social posts.');
      }
    } catch (error) {
      console.error('Error fetching social posts:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMorePosts = () => {
    // Fire next page query if another data layer is verified on the backend
    if (currentPage < totalPages && !loadingMore) {
      const nextPage = currentPage + 1;
      fetchSocialPosts(nextPage, false);
    }
  };

  // Profile picture or Name click handler
  const handleProfilePress = (userId: string, postId: string) => {
    navigation.navigate('UserProfile', { userId, postId });
  };

  // Comment icon click handler
  const handleCommentPress = (item: any) => {
    navigation.navigate('PostDetails', { 
    postId: item.id 
  });
  };

  // Optimized live execution handle for toggling user likes with optimistic state updates
  const handleLikePress = async (postId: string, currentStatus: boolean) => {
    // 1. Optimistically update local UI state immediately for responsive interaction
    setPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isPatted: !currentStatus,
            pats: currentStatus ? post.pats - 1 : post.pats + 1,
          };
        }
        return post;
      })
    );

    try {
      // 2. Execute network synchronization request payload
      const json = await postService.toggleLike(postId);

      // Rollback or adjust state if backend response indicates failure
      if (!json || !json.success) {
        throw new Error(json?.message || 'Failed to update like status on server.');
      }
    } catch (error) {
      console.error('Error toggling like status state:', error);
      
      // 3. Rollback UI instantly if API communication breaks
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              isPatted: currentStatus,
              pats: currentStatus ? post.pats + 1 : post.pats - 1,
            };
          }
          return post;
        })
      );
      Alert.alert('Error', 'Could not sync like status with server.');
    }
  };

  // Viewability configuration to detect when a card takes up at least 60% of the screen viewport
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setActiveVideoPostId(viewableItems[0].item.id);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60,
  }).current;

  // Render a dynamic spinner inside the list footer when grabbing more pages
  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#76A065" />
      </View>
    );
  };

  // Renders when list is empty and data fetching has finished
  const renderEmptyComponent = () => {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No social posts shared yet.</Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Social</Text>
        <TouchableOpacity
          style={styles.createPostButton}
          onPress={() => {
            navigation.navigate('CreatePost', {
              from: 'SocialList',
            });
          }}
        >
          <Text style={styles.createPostText}>Create Post</Text>
        </TouchableOpacity>
      </View>

      {/* Main Posts Feed */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#76A065" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              isActive={item.id === activeVideoPostId}
              onProfilePress={handleProfilePress}
              onCommentPress={() => handleCommentPress(item)}
              onLikePress={handleLikePress}
            />
          )}
          contentContainerStyle={[
            styles.listContent,
            posts.length === 0 && { flex: 1 }, // Allows empty container view layout to grow full height
            { paddingBottom: 100 + insets.bottom }, // Keeps extra spacing safe for bottom tab layouts
          ]}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMorePosts}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={renderEmptyComponent}
        />
      )}
    </View>
  );
};

export default SocialScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createPostButton: {
    backgroundColor: '#1C281A',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2E3D2A',
  },
  createPostText: {
    color: '#76A065',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    color: '#8A8A8E',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import PostCard, { PostData } from '../../components/PostCard/PostCard';
import { postService } from '../../services/postService';
import colors from '../../theme/colors';
import { useSelector } from 'react-redux';

const SURFACE_COLOR = colors.gray_4 || '#1C1C1E';
const PRIMARY_GREEN = colors.primary || '#688A3E';
const TEXT_MUTED = colors.gray_2 || '#8A8A8E';

interface CommentData {
  id: string;
  userId: string;
  name: string;
  content: string;
  pats: number;
  isPatted: boolean;
  repliesCount: number;
  postedTime: string;
}

const PostDetailsScreen = ({ route, navigation }: any) => {
  const user = useSelector((state: any) => state.auth.user);
  const name = user?.name || '';
  const userId = user?.id || '';
  const insets = useSafeAreaInsets();
  const { postId, parentCommentId, onCommentAdded } = route.params || {};

  // Content States
  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<CommentData[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  // Loading States
  const [loadingPost, setLoadingPost] = useState<boolean>(true);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [loadingMoreComments, setLoadingMoreComments] = useState<boolean>(false);
  const [submittingComment, setSubmittingComment] = useState<boolean>(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const loadScreenData = async () => {
      const postLoadedSuccessfully = await fetchPostDetails();
      if (postLoadedSuccessfully) {
        fetchComments(1, true);
      }
    };

    loadScreenData();
  }, [postId, parentCommentId]);

  const fetchPostDetails = async (): Promise<boolean> => {
    try {
      setLoadingPost(true);
      const json = await postService.getPostDetails(postId);
      
      if (json && json.success && json.data?.post) {
        setPost(json.data.post);
        return true;
      } else {
        Alert.alert('Error', json?.message || 'Failed to load post details.');
        return false;
      }
    } catch (error) {
      console.error('Error getting post details:', error);
      Alert.alert('Error', 'Could not retrieve post metadata configurations.');
      return false;
    } finally {
      setLoadingPost(false);
    }
  };

  const fetchComments = async (pageToFetch: number, isInitialRefresh: boolean = false) => {
    if (loadingComments || loadingMoreComments) return;

    try {
      if (isInitialRefresh) {
        setLoadingComments(true);
      } else {
        setLoadingMoreComments(true);
      }

      const targetCommentId = parentCommentId || '';
      const json = await postService.getComments(pageToFetch, 5, targetCommentId, postId);

      if (json && json.success && json.data) {
        const fetchedComments = json.data.comments || json.data.replies || [];
        if (isInitialRefresh) {
          setComments(fetchedComments);
          setCurrentPage(1);
        } else {
          setComments((prev) => [...prev, ...fetchedComments]);
          setCurrentPage(pageToFetch);
        }
        setTotalPages(json.data.pages || 1);
      }
    } catch (error) {
      console.error('Error fetching list comments:', error);
    } finally {
      setLoadingComments(false);
      setLoadingMoreComments(false);
    }
  };

  const handleLoadMoreComments = () => {
    if (currentPage < totalPages && !loadingMoreComments) {
      fetchComments(currentPage + 1, false);
    }
  };

  const handlePostComment = async () => {
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);

      const payload: { postId: string; content: string; parentCommentId?: string } = {
        postId: postId,
        content: commentText.trim(),
      };

      if (parentCommentId) {
        payload.parentCommentId = parentCommentId;
      }

      const json = await postService.createComment(payload);

      if (json && json.success) {
        setCommentText('');
        
        const fallbackNewComment: CommentData = json.data || {
          id: Math.random().toString(),
          userId: userId,
          name: name,
          content: payload.content,
          pats: 0,
          isPatted: false,
          repliesCount: 0,
          postedTime: new Date().toISOString()
        };

        setComments((prev) => [fallbackNewComment, ...prev]);

        if (onCommentAdded) {
          onCommentAdded(parentCommentId, postId);
        }
        
        if (post) {
          setPost({
            ...post,
            totalComments: post.totalComments + 1,
          });
        }
      } else {
        Alert.alert('Error', json?.message || 'Failed to submit comment.');
      }
    } catch (error) {
      console.error('Error creating post comment:', error);
      Alert.alert('Error', 'Network connectivity error syncing your comment request.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleProfilePress = (userId: string, targetPostId: string) => {
    navigation.navigate('UserProfile', { userId, postId: targetPostId });
  };

  const handleCommentPress = (userId: string, targetPostId: string) => {
    console.log('Already displaying context for node:', targetPostId);
  };

  const handleLikePress = async (targetPostId: string, currentStatus: boolean) => {
    if (!post) return;

    setPost({
      ...post,
      isPatted: !currentStatus,
      pats: currentStatus ? post.pats - 1 : post.pats + 1,
    });

    try {
      const json = await postService.toggleLike(targetPostId);
      if (!json || !json.success) {
        throw new Error(json?.message || 'Failed to sync with server.');
      }
    } catch (error) {
      console.error('Error toggling like status state:', error);
      setPost({
        ...post,
        isPatted: currentStatus,
        pats: currentStatus ? post.pats + 1 : post.pats - 1,
      });
      Alert.alert('Error', 'Could not sync like status with server.');
    }
  };

  // NEW: Optimistic UI handler for commenting node likes
  const handleCommentLikePress = async (commentId: string, currentStatus: boolean) => {
    setComments((prevComments) =>
      prevComments.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isPatted: !currentStatus,
              pats: currentStatus ? c.pats - 1 : c.pats + 1,
            }
          : c
      )
    );

    try {
      const json = await postService.toggleCommentLike(commentId);
      if (!json || !json.success) {
        throw new Error(json?.message || 'Failed to sync target comment like.');
      }
    } catch (error) {
      console.error('Error toggling comment like:', error);
      // Rollback to original state if request fails
      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === commentId
            ? {
                ...c,
                isPatted: currentStatus,
                pats: currentStatus ? c.pats + 1 : c.pats - 1,
              }
            : c
        )
      );
      Alert.alert('Error', 'Could not sync comment like status.');
    }
  };

  const handleReplyPress = (commentId: string) => {
    navigation.push('PostDetails', {
      postId: postId,
      parentCommentId: commentId,
      onCommentAdded: (commentIdId: string, targetPostId?: string) => {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === commentIdId ? { ...c, repliesCount: c.repliesCount + 1 } : c
          )
        );

        if (targetPostId && post) {
          setPost((prevPost) => 
            prevPost ? { ...prevPost, totalComments: prevPost.totalComments + 1 } : null
          );
        }
      }
    });
  };

  const renderCommentItem = ({ item }: { item: CommentData }) => {
    const avatarInitials = item.name ? item.name.substring(0, 2).toUpperCase() : 'HO';
    return (
      <View style={styles.commentCard}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAvatar}>
            <Text style={styles.avatarText}>{avatarInitials}</Text>
          </View>
          <View style={styles.commentMeta}>
            <Text style={styles.commentName}>{item.name}</Text>
            <Text style={styles.commentTime}>
              {new Date(item.postedTime).toLocaleDateString()}
            </Text>
          </View>
        </View>
        
        <Text style={styles.commentContent}>{item.content}</Text>

        <View style={styles.commentFooter}>
          {/* UPDATED: Wrapped in a TouchableOpacity to enable liking comments */}
          <TouchableOpacity 
            style={styles.likeCommentButton}
            onPress={() => handleCommentLikePress(item.id, item.isPatted)}
          >
            <Text style={[styles.patsCounter, item.isPatted && styles.likedPatsCounter]}>
              👍 {item.pats}
            </Text>
          </TouchableOpacity>
          
          {!parentCommentId && (
            <TouchableOpacity 
              style={styles.replyButton} 
              onPress={() => handleReplyPress(item.id)}
            >
              <Text style={styles.replyButtonText}>
                Reply {item.repliesCount > 0 ? `(${item.repliesCount})` : ''}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMoreComments) return null;
    return (
      <ActivityIndicator size="small" color={PRIMARY_GREEN} style={{ marginVertical: 12 }} />
    );
  };

  const renderEmptyComponent = () => {
    if (loadingComments) return null;
    return (
      <View style={styles.emptyCommentsContainer}>
        <Text style={styles.emptyCommentsText}>💬 No conversations yet. Start the thread!</Text>
      </View>
    );
  };

  if (loadingPost) {
    return (
      <View style={styles.loadingCenter}>
        <ActivityIndicator size="large" color={PRIMARY_GREEN} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <SafeAreaView edges={['top', 'left', 'right']} style={styles.container}>
        <View style={styles.navigationHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.navigationTitle}>
            {parentCommentId ? 'Replies' : 'Post Details'}
          </Text>
          <View style={{ width: 50 }} />
        </View>

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          renderItem={renderCommentItem}
          ListHeaderComponent={() => (
            <View style={styles.headerWrapper}>
              {post && (
                <PostCard
                  post={post}
                  isActive={true} 
                  onProfilePress={handleProfilePress}
                  onCommentPress={handleCommentPress}
                  onLikePress={handleLikePress}
                />
              )}
              <Text style={styles.sectionDividerTitle}>
                {parentCommentId ? 'Thread Replies' : 'Comments'}
              </Text>
            </View>
          )}
          contentContainerStyle={[
            styles.scrollContainer,
            comments.length === 0 && { flexGrow: 1 },
          ]}
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooter}
          onEndReached={handleLoadMoreComments}
          onEndReachedThreshold={0.4}
          showsVerticalScrollIndicator={false}
        />

        <SafeAreaView edges={['bottom']} style={styles.inputBarContainer}>
          <View style={styles.inputBar}>
            <TextInput
              style={styles.inputField}
              placeholder={parentCommentId ? "Write a reply..." : "Add a comment..."}
              placeholderTextColor="#8E8E93"
              value={commentText}
              onChangeText={setCommentText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              style={[styles.sendButton, !commentText.trim() && styles.disabledSend]}
              onPress={handlePostComment}
              disabled={!commentText.trim() || submittingComment}
            >
              {submittingComment ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.sendButtonText}>Post</Text>
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default PostDetailsScreen;

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingCenter: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: SURFACE_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1C1C1E',
  },
  backButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: PRIMARY_GREEN,
    fontSize: 16,
    fontWeight: '600',
  },
  navigationTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 20,
  },
  headerWrapper: {
    marginBottom: 16,
  },
  sectionDividerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  commentCard: {
    backgroundColor: SURFACE_COLOR,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 0.5,
    borderColor: '#2C2C2E',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1C2814',
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  commentMeta: {
    flex: 1,
  },
  commentName: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: TEXT_MUTED,
    fontSize: 11,
    marginTop: 1,
  },
  commentContent: {
    color: '#E5E5EA',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
    paddingLeft: 2,
  },
  commentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
  },
  likeCommentButton: {
    paddingVertical: 4,
    paddingRight: 12,
  },
  patsCounter: {
    color: TEXT_MUTED,
    fontSize: 12,
  },
  likedPatsCounter: {
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
  replyButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  replyButtonText: {
    color: PRIMARY_GREEN,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyCommentsContainer: {
    paddingVertical: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCommentsText: {
    color: TEXT_MUTED,
    fontSize: 14,
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
    color: PRIMARY_GREEN,
    fontWeight: '700',
    fontSize: 16,
  },
});
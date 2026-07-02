import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';

// Custom interface matching the dataset being sent from HelpListScreen
export interface PostData {
  id: string;
  username: string;
  userInitials: string;
  timeAgo: string;
  content: string;
  hashtags?: string[];
  likes: number;
  comments: number;
}

interface PostCardProps {
  post: PostData;
  onPostPress?: () => void;
  onProfilePress?: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onPostPress, onProfilePress }) => {
  return (
    <TouchableOpacity 
      activeOpacity={0.9} 
      onPress={onPostPress} 
      style={styles.cardContainer}
    >
      {/* Top Profile Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity activeOpacity={0.7} onPress={onProfilePress} style={styles.avatar}>
          <Text style={styles.avatarText}>{post.userInitials}</Text>
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <TouchableOpacity activeOpacity={0.7} onPress={onProfilePress}>
            <Text style={styles.username}>{post.username}</Text>
          </TouchableOpacity>
          <Text style={styles.bulletPoint}> • </Text>
          <Text style={styles.timeAgo}>{post.timeAgo}</Text>
        </View>
      </View>

      {/* Main Post Text Content */}
      <Text style={styles.postContent}>{post.content}</Text>

      {/* Optional Hashtags Layout */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.hashtagContainer}>
          {post.hashtags.map((tag, index) => (
            <Text key={index} style={styles.hashtagText}>
              {tag}{' '}
            </Text>
          ))}
        </View>
      )}

      {/* Footer Stats Row (Likes & Comments Buttons) */}
      <View style={styles.footerRow}>
        {/* Like Section Container */}
        <TouchableOpacity activeOpacity={0.6} style={styles.statButton}>
          {/* Heart icon placeholder constructed with pure UI shapes matching screenshot shape */}
          <View style={styles.iconWrapper}>
            <Text style={styles.emojiIcon}>🤍</Text> 
          </View>
          <Text style={styles.statCount}>{post.likes}</Text>
        </TouchableOpacity>

        {/* Comment Section Container */}
        <TouchableOpacity activeOpacity={0.6} style={styles.statButton}>
          <View style={styles.iconWrapper}>
            <Text style={styles.emojiIcon}>💬</Text>
          </View>
          <Text style={styles.statCount}>{post.comments}</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#141414', // Matches the lighter dark grey post block fill color
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FFFFFF', // Clean flat white profile circle matching screen capture
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  bulletPoint: {
    color: '#666666',
    fontSize: 14,
    marginHorizontal: 4,
  },
  timeAgo: {
    color: '#666666', // Subtle dull text color for timestamping metadata details
    fontSize: 14,
  },
  postContent: {
    color: '#EAEAEA',
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 14,
  },
  hashtagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },
  hashtagText: {
    color: '#5C7A50', // Clean olive tint matches #SAVE_HUMANITY style specs
    fontSize: 14,
    fontWeight: '700',
    marginRight: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24, // Keeps modern native spacing clean between actionable metric triggers
  },
  statButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    marginRight: 8,
  },
  emojiIcon: {
    fontSize: 16,
    opacity: 0.85,
  },
  statCount: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
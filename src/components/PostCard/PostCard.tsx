import React, { useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');
const PRIMARY_GREEN = colors.primary || '#688A3E';
const SURFACE_COLOR = colors.gray_4 || '#1C1C1E';
const TEXT_MUTED = colors.gray_2 || '#8A8A8E';

export interface MediaItem {
  type: 'image' | 'video';
  uri: string;
  _id: string;
  uploadedAt: string;
}

export interface PostData {
  id: string;
  userId: string;
  name: string;
  content: string;
  pats: number;
  isPatted: boolean;
  totalComments: number;
  media: MediaItem[];
  postedTime: string;
  hashtags: string[];
  dislikes: number; 
  youtubeUrl?: string;
}

interface PostCardProps {
  post: PostData;
  isActive: boolean; 
  onProfilePress: (userId: string, postId: string) => void;
  onCommentPress: (userId: string, postId: string) => void;
  onLikePress: (postId: string, currentStatus: boolean) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  isActive,
  onProfilePress,
  onCommentPress,
  onLikePress,
}) => {
  const initials = post.name ? post.name.substring(0, 2).toUpperCase() : 'HO';

  return (
    <View style={styles.cardContainer}>
      {/* Header Segment */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.profileClickable}
          onPress={() => onProfilePress(post.userId, post.id)}
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View>
            <Text style={styles.profileName}>{post.name}</Text>
            <Text style={styles.timeText}>
              {new Date(post.postedTime).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Main Context Text */}
      {post.content ? (
        <Text style={styles.contentBody}>{post.content}</Text>
      ) : null}

      {/* Hashtags Segment */}
      {post.hashtags && post.hashtags.length > 0 && (
        <View style={styles.tagRow}>
          {post.hashtags.map((tag, idx) => (
            <Text key={idx} style={styles.hashtagText}>
              {tag.startsWith('#') ? tag : `#${tag}`}{' '}
            </Text>
          ))}
        </View>
      )}

      {/* Media Attachments Section */}
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          {post.media.map((item) => {
            if (item.type && item.type.startsWith('video')) {
              return (
                <Video
                  key={item._id}
                  source={{ uri: item.uri }}
                  style={styles.videoAsset}
                  resizeMode="cover"
                  repeat={true}
                  muted={false}
                  paused={!isActive} // Controlled globally by feed visibility
                  playInBackground={false}
                  playWhenInactive={false}
                  ignoreSilentSwitch="ignore"
                  mixWithOthers="mix" // Prevents audio session contentions that trigger native crashes
                />
              );
            }
            return (
              <Image
                key={item._id}
                source={{ uri: item.uri }}
                style={styles.imageAsset}
                resizeMode="cover"
              />
            );
          })}
        </View>
      )}

      {/* Interaction Footer Row */}
      <View style={styles.footerActionRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity
            style={[styles.actionButton, post.isPatted && styles.activeAction]}
            onPress={() => onLikePress(post.id, post.isPatted)}
          >
            <Text style={[styles.actionText, post.isPatted && styles.activeText]}>
              👍 {post.pats}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress(post.userId, post.id)}
        >
          <Text style={styles.actionText}>💬 {post.totalComments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default React.memo(PostCard);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: SURFACE_COLOR,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.5,
    borderColor: '#2C2C2E',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileClickable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    backgroundColor: '#1C2814',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 14,
  },
  profileName: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  timeText: {
    color: TEXT_MUTED,
    fontSize: 12,
    marginTop: 2,
  },
  contentBody: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 10,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  hashtagText: {
    color: PRIMARY_GREEN,
    fontSize: 14,
    fontWeight: '500',
  },
  mediaContainer: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 12,
    position: 'relative', // Context for absolute tracking
  },
  videoAsset: {
    position: 'absolute', // Absolute breaks it out of standard rendering flex-clashes
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  imageAsset: {
    width: '100%',
    height: '100%',
  },
  footerActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: '#2C2C2E',
    paddingTop: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 12,
  },
  activeAction: {
    backgroundColor: '#1C2814',
    borderColor: PRIMARY_GREEN,
    borderWidth: 0.5,
  },
  actionText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '500',
  },
  activeText: {
    color: PRIMARY_GREEN,
    fontWeight: '600',
  },
});
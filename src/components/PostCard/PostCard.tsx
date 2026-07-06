import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Video from 'react-native-video';
import { useIsFocused } from '@react-navigation/native';
import colors from '../../theme/colors';

const { width } = Dimensions.get('window');

const SLIDE_WIDTH = width - 64; 

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
  const isScreenFocused = useIsFocused();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // State for text expansion
  
  const initials = post.name ? post.name.substring(0, 2).toUpperCase() : 'HO';

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollOffset / SLIDE_WIDTH);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

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

      {/* Main Context Text with Toggle */}
      {post.content ? (
        <View style={styles.contentContainer}>
          <Text 
            style={styles.contentBody}
            numberOfLines={isExpanded ? undefined : 3}
          >
            {post.content}
          </Text>
          {post.content.length > 100 && (
            <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
              <Text style={styles.toggleText}>
                {isExpanded ? 'Show Less' : 'Show More'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
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

      {/* Media Scrollable Block */}
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            bounces={false}
            style={styles.scrollViewStyle}
          >
            {post.media.map((item, index) => (
              <View key={item._id} style={styles.slide}>
                {item.type && item.type.startsWith('video') ? (
                  <Video
                    source={{ uri: item.uri }}
                    style={styles.mediaAsset}
                    resizeMode="cover"
                    repeat={true}
                    muted={false}
                    paused={!isActive || !isScreenFocused || activeIndex !== index} 
                    playInBackground={false}
                    playWhenInactive={false}
                    ignoreSilentSwitch="ignore"
                    mixWithOthers="mix"
                  />
                ) : (
                  <Image
                    source={{ uri: item.uri }}
                    style={styles.mediaAsset}
                    resizeMode="cover"
                  />
                )}
              </View>
            ))}
          </ScrollView>

          {post.media.length > 1 && (
            <View style={styles.paginationRow}>
              {post.media.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    activeIndex === index ? styles.activeDot : styles.inactiveDot,
                  ]}
                />
              ))}
            </View>
          )}
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
  contentContainer: {
    marginBottom: 10,
  },
  contentBody: {
    color: '#FFF',
    fontSize: 15,
    lineHeight: 22,
  },
  toggleText: {
    color: PRIMARY_GREEN,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
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
    width: SLIDE_WIDTH,
    height: 250,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 12,
  },
  scrollViewStyle: {
    width: SLIDE_WIDTH,
    height: 250,
  },
  slide: {
    width: SLIDE_WIDTH,
    height: 250,
  },
  mediaAsset: {
    width: '100%',
    height: '100%',
  },
  paginationRow: {
    position: 'absolute',
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 4,
  },
  activeDot: {
    width: 14,
    backgroundColor: PRIMARY_GREEN,
  },
  inactiveDot: {
    width: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
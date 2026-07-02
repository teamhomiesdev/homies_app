import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // 👈 Using your project's context hook
import PostCard from '../../components/PostCard/PostCard'; 

interface Post {
  id: string;
  username: string;
  userInitials: string;
  timeAgo: string;
  content: string;
  hashtags?: string[];
  likes: number;
  comments: number;
}

const HelpListScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets(); // 👈 Get precise system notch/island offsets
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchHelpPosts();
  }, []);

  const fetchHelpPosts = async () => {
    try {
      setLoading(true);
      const mockData: Post[] = [
        {
          id: '1',
          username: 'homie_upqxbqvue',
          userInitials: 'HO',
          timeAgo: '3 hrs ago',
          content: "My wife is asking for divorce because she doesn't want to live with my parents",
          likes: 1,
          comments: 2,
        },
        {
          id: '2',
          username: 'homie_lwnohhnnl',
          userInitials: 'HO',
          timeAgo: '3 hrs ago',
          content: 'My wife sent away from own house I am living now in car',
          likes: 1,
          comments: 2,
        },
        {
          id: '3',
          username: 'homie_u40fv2on6',
          userInitials: 'H4',
          timeAgo: '11 hrs ago',
          content: 'dfbfd',
          hashtags: ['#SAVE_HUMANITY', '#SAVE_MEN'],
          likes: 0,
          comments: 0,
        },
         {
          id: '1',
          username: 'homie_upqxbqvue',
          userInitials: 'HO',
          timeAgo: '3 hrs ago',
          content: "My wife is asking for divorce because she doesn't want to live with my parents",
          likes: 1,
          comments: 2,
        },
        {
          id: '2',
          username: 'homie_lwnohhnnl',
          userInitials: 'HO',
          timeAgo: '3 hrs ago',
          content: 'My wife sent away from own house I am living now in car',
          likes: 1,
          comments: 2,
        },
        {
          id: '3',
          username: 'homie_u40fv2on6',
          userInitials: 'H4',
          timeAgo: '11 hrs ago',
          content: 'dfbfd',
          hashtags: ['#SAVE_HUMANITY', '#SAVE_MEN'],
          likes: 0,
          comments: 0,
        },
      ];
      setPosts(mockData);
    } catch (error) {
      console.error("Error fetching help posts:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dynamic top padding prevents text from hiding under the status bar/notch
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header Bar */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Homies</Text>
        <TouchableOpacity 
          style={styles.createPostButton} 
          onPress={() => navigation.navigate('CreatePost')}
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
          renderItem={({ item }) => (
            <PostCard 
              post={item}
              onPostPress={() => navigation.navigate('PostDetails', { postId: item.id })}
              onProfilePress={() => navigation.navigate('UserProfile', { username: item.username })}
            />
          )}
          // Extra bottom padding ensures cards scroll completely clear of your custom active floating nav bar
          contentContainerStyle={[styles.listContent, { paddingBottom: 100 + insets.bottom }]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default HelpListScreen;

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
  }
});
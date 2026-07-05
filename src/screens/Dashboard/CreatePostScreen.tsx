import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ImagePicker from 'react-native-image-crop-picker';
import colors from '../../theme/colors';
import { hashtagService, postService } from '../../services/postService';

const BG_COLOR = colors.black_1 || '#0A0A0A';
const SURFACE_COLOR = colors.gray_4 || '#1C1C1E';
const TEXT_MUTED = colors.gray_2 || '#8A8A8E';
const PRIMARY_GREEN = colors.primary || '#688A3E';

interface MediaFile {
  path: string;
  mime: string;
  filename?: string;
}

const CreatePostScreen = ({ navigation, route }: any) => {
  const fromSource = route.params?.from || 'Social';
  const postType = fromSource === 'HelpList' ? 'HELP' : 'SOCIAL';
  
  // Decides whether to show the media attachments block
  const isSocialFlow = postType === 'SOCIAL'; 

  const [postText, setPostText] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isLoadingHashtags, setIsLoadingHashtags] = useState<boolean>(true);
  const [isUploadingMedia, setIsUploadingMedia] = useState<boolean>(false);
  const [isPosting, setIsPosting] = useState(false);

  // Validation flag: Check if there is either text content OR an uploaded photo/video
  const hasValidContent = postText.trim().length > 0 || mediaFiles.length > 0;

  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setIsLoadingHashtags(true);
        const json = await hashtagService.getHashtags();

        if (json && json.success && json.data?.hashtags) {
          const formattedTags = json.data.hashtags.map((tag: string) =>
            tag.startsWith('#') ? tag : `#${tag}`,
          );
          setHashtags(formattedTags);
        } else {
          Alert.alert(
            'Error',
            json.message || 'Failed to retrieve active hashtags.',
          );
        }
      } catch (error: any) {
        const errorMsg =
          error.response?.data?.message ||
          'Could not load active community hashtags.';
        Alert.alert('Network Error', errorMsg);
      } finally {
        setIsLoadingHashtags(false);
      }
    };

    fetchHashtags();
  }, []);

  const requestGalleryPermission = async (): Promise<boolean> => {
    if (Platform.OS !== 'android') return true;

    try {
      if (Platform.Version >= 33) {
        const grantedImages = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: 'Gallery Access Permission',
            message: 'This app requires access to your gallery to upload images.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        const grantedVideos = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
          {
            title: 'Gallery Access Permission',
            message: 'This app requires access to your gallery to upload videos.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return (
          grantedImages === PermissionsAndroid.RESULTS.GRANTED &&
          grantedVideos === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Storage Access Permission',
            message: 'This app requires access to your storage to upload media files.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const toggleHashtag = (tag: string) => {
    if (selectedHashtags.includes(tag)) {
      setSelectedHashtags(selectedHashtags.filter(t => t !== tag));
    } else {
      setSelectedHashtags([...selectedHashtags, tag]);
    }
  };

  const handlePickMedia = async () => {
    const remainingSlots = 5 - mediaFiles.length;
    if (remainingSlots <= 0) {
      Alert.alert('Limit Reached', 'You can upload a maximum of 5 media files.');
      return;
    }

    const hasPermission = await requestGalleryPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Please grant gallery permissions in settings to upload media.');
      return;
    }

    try {
      const results = await ImagePicker.openPicker({
        multiple: true,
        maxFiles: remainingSlots,
        mediaType: 'any',
      });

      const data = new FormData();
      results.forEach((item) => {
        const localUri = item.path;
        const filename = localUri.split('/').pop() || `file_${Date.now()}`;
        
        data.append('files', {
          uri: Platform.OS === 'android' ? localUri : localUri.replace('file://', ''),
          type: item.mime,
          name: filename,
        } as any);
      });

      setIsUploadingMedia(true);

      const response = await postService.uploadMediaFiles(data);

      if (response && response.success && response.data?.files) {
        const remoteMedia = response.data.files.map((file: any) => ({
          path: file.url || file.path || '',
          mime: file.mimetype || file.mime || 'image/jpeg',
          filename: file.filename || '',
        }));

        setMediaFiles((prev) => [...prev, ...remoteMedia].slice(0, 5));
      } else {
        Alert.alert('Upload Failed', response.message || 'Unable to store files on the server.');
      }
    } catch (error: any) {
      if (error?.message !== 'User cancelled image selection') {
        const errorMsg = error.response?.data?.message || 'Something went wrong while uploading files.';
        Alert.alert('Upload Error', errorMsg);
      }
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const removeMediaItem = (index: number) => {
    setMediaFiles(mediaFiles.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    // Check if both text and photos are empty before proceeding
    if (!hasValidContent) {
      Alert.alert('Error', 'Please provide text content or upload at least one image before posting.');
      return;
    }

    try {
      setIsPosting(true);

      const formattedMedia = mediaFiles.map((file) => ({
        type: file.mime.startsWith('video/') ? 'video' : 'image',
        uri: file.path,
      }));

      const formattedHashtags = selectedHashtags.map((tag) =>
        tag.replace('#', ''),
      );

      const payload = {
        type: postType as 'HELP' | 'SOCIAL',
        content: postText,
        media: formattedMedia,
        hashtags: formattedHashtags,
      };

      const response = await postService.createPost(payload);

      if (response && (response.success || response.status === 201 || response.id)) {
        Alert.alert('Success', 'Post created successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to complete the post transmission.');
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to submit post.';
      Alert.alert('Submission Error', errorMsg);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          disabled={isPosting || isUploadingMedia}
        >
          <Text style={styles.headerCancel}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Post</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            (!hasValidContent || isPosting || isUploadingMedia) && styles.postButtonDisabled,
          ]}
          onPress={handleCreatePost}
          disabled={!hasValidContent || isPosting || isUploadingMedia}
        >
          {isPosting ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>H6</Text>
          </View>
          <TextInput
            style={styles.textInput}
            placeholder={isSocialFlow ? "What's on your mind?" : "Describe what help you need..."}
            placeholderTextColor={TEXT_MUTED}
            multiline
            value={postText}
            onChangeText={setPostText}
            editable={!isPosting}
          />
        </View>

        {isSocialFlow && (
          <View style={styles.mediaSection}>
            <Text style={styles.sectionTitle}>
              Attached Media ({mediaFiles.length}/5)
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.mediaScroll}
            >
              {mediaFiles.map((file, index) => (
                <View key={index} style={styles.mediaWrapper}>
                  <Image source={{ uri: file.path }} style={styles.mediaItem} />
                  <TouchableOpacity
                    style={styles.removeBadge}
                    onPress={() => removeMediaItem(index)}
                    disabled={isUploadingMedia || isPosting}
                  >
                    <Text style={styles.removeText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
              
              {isUploadingMedia ? (
                <View style={[styles.addMediaBox, styles.mediaLoaderBox]}>
                  <ActivityIndicator size="small" color={PRIMARY_GREEN} />
                  <Text style={styles.addMediaSubtext}>Uploading...</Text>
                </View>
              ) : (
                mediaFiles.length < 5 && (
                  <TouchableOpacity
                    style={styles.addMediaBox}
                    onPress={handlePickMedia}
                    disabled={isPosting}
                  >
                    <Text style={styles.addMediaPlus}>+</Text>
                    <Text style={styles.addMediaSubtext}>Image/Video</Text>
                  </TouchableOpacity>
                )
              )}
            </ScrollView>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.hashtagSection}>
          {hashtags?.length > 0 && (
            <Text style={styles.sectionTitle}>Select Hashtags</Text>
          )}

          {isLoadingHashtags ? (
            <View style={styles.loaderWrapper}>
              <ActivityIndicator size="small" color={PRIMARY_GREEN} />
            </View>
          ) : (
            <View style={styles.tagContainer}>
              {hashtags.map(tag => {
                const isSelected = selectedHashtags.includes(tag);
                return (
                  <TouchableOpacity
                    key={tag}
                    activeOpacity={0.7}
                    onPress={() => toggleHashtag(tag)}
                    disabled={isPosting}
                    style={[styles.tag, isSelected && styles.tagSelected]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        isSelected && styles.tagTextSelected,
                      ]}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreatePostScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_COLOR },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2C2C2E',
  },
  headerCancel: { color: TEXT_MUTED, fontSize: 18, fontWeight: '400' },
  headerTitle: {
    color: colors.white || '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  postButton: {
    backgroundColor: PRIMARY_GREEN,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 14,
    minWidth: 70,
    alignItems: 'center',
  },
  postButtonDisabled: { opacity: 0.5 },
  postButtonText: {
    color: colors.white || '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: { paddingVertical: 20 },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: PRIMARY_GREEN,
    backgroundColor: '#1C2814',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: colors.white || '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    color: colors.white || '#FFF',
    fontSize: 18,
    paddingTop: 10,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  divider: { height: 0.5, backgroundColor: '#2C2C2E', marginVertical: 10 },
  hashtagSection: { paddingHorizontal: 16, paddingTop: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white || '#FFF',
    marginBottom: 16,
  },
  loaderWrapper: { paddingVertical: 20, alignItems: 'center' },
  tagContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: SURFACE_COLOR,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  tagSelected: { borderColor: PRIMARY_GREEN, backgroundColor: '#1C2814' },
  tagText: { color: TEXT_MUTED, fontSize: 14, fontWeight: '500' },
  tagTextSelected: { color: colors.white || '#FFF', fontWeight: '600' },
  mediaSection: { paddingHorizontal: 16, marginVertical: 15 },
  mediaScroll: { 
    flexDirection: 'row',
    paddingTop: 8,
  },
  mediaWrapper: { 
    marginRight: 12, 
    position: 'relative',
    marginTop: 4,
  },
  mediaItem: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: SURFACE_COLOR,
  },
  removeBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', bottom: 1 },
  addMediaBox: {
    width: 80,
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: TEXT_MUTED,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SURFACE_COLOR,
    marginTop: 4,
  },
  mediaLoaderBox: {
    borderStyle: 'solid',
    borderColor: '#2C2C2E',
  },
  addMediaPlus: { color: TEXT_MUTED, fontSize: 24, fontWeight: '300' },
  addMediaSubtext: { color: TEXT_MUTED, fontSize: 10, marginTop: 2 },
});
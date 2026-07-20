# Homies App — Project Information

## General

| Field           | Value                        |
|----------------|------------------------------|
| App Name        | Homies - Men Ki Baat         |
| Package Name    | homies                       |
| Version         | 0.0.1                        |
| Framework       | React Native 0.86.0          |
| Language        | TypeScript                   |
| Website         | https://homies.support/      |
| Privacy Policy  | https://homies.support/privacy |

---

## Platform

- Android
- iOS

---

## App Description

**Homies - Men Ki Baat** is a social community app designed for men. It enables users to connect, share posts, request/offer help, chat in real-time, and engage in community events.

---

## Screens

### Auth Flow
- `LoginScreen` — Email/Google sign-in
- `RegisterScreen` — New user registration
- `BasicDetailsScreen` — Profile setup (name, age, etc.)
- `FaceVerificationScreen` — Face-based identity verification using camera
- `HelpSelectionScreen` — Choose help categories
- `InterestSelectionScreen` — Choose personal interests
- `UserIdGeneratedScreen` — Unique user ID confirmation

### Main App (Bottom Tab Navigation)
| Tab         | Screen              | Description                         |
|-------------|---------------------|-------------------------------------|
| Social      | `SocialScreen`      | Community posts feed                |
| TrueEvents  | `TrueEventsScreen`  | Real events and meetups             |
| HelpList    | `HelpListScreen`    | Help requests (center tab/home)     |
| Profile     | `ProfileScreen`     | User profile                        |
| Chat        | `ChatScreen`        | All conversations                   |

### Additional Screens
- `ChatWindowScreen` — Individual chat conversation
- `CreatePostScreen` — Create a new post
- `PostDetailsScreen` — View post details
- `UserProfileScreen` — View another user's profile

---

## Key Dependencies

| Package                              | Purpose                        |
|--------------------------------------|--------------------------------|
| `react-native-vision-camera`         | Camera / Face verification     |
| `react-native-image-picker`          | Image upload                   |
| `react-native-image-crop-picker`     | Image cropping                 |
| `react-native-video`                 | Video playback                 |
| `socket.io-client`                   | Real-time chat                 |
| `@react-native-google-signin`        | Google authentication          |
| `@react-navigation/bottom-tabs`      | Bottom tab navigation          |
| `@reduxjs/toolkit` + `redux-persist` | State management               |
| `axios`                              | HTTP API calls                 |
| `lottie-react-native`                | Animations                     |
| `react-native-fs`                    | File system access             |
| `react-native-modal-datetime-picker` | Date/time picker               |

---

## Architecture

- **State Management**: Redux Toolkit + Redux Persist (via AsyncStorage)
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **API**: Axios for REST calls
- **Real-time**: Socket.IO client for chat
- **Auth**: Google Sign-In + custom email/password

---

## Google Play Store Info

- **Target Audience**: Men (18+)
- **App Category**: Social
- **Contains**: User-generated content, real-time chat, camera usage, image/video upload
- **Authentication**: Required (Login with email or Google)
- **Government App**: No
- **Financial Features**: None
- **Health Features**: None
- **Advertising ID**: To be confirmed

---

## App Icon

- **Background**: Sage/olive green with a subtle textured grain effect
- **Logo**: White "H" shaped icon that doubles as two human figures standing side by side — representing friendship/community
- **Text**: "HOMIES" in bold white uppercase, "MEN KI BAAT" in smaller white uppercase below
- **Style**: Minimalist, clean, community-focused
- **Color Palette**: 
  - Primary Green: `#6B9E6B` (approx sage green)
  - Icon/Text: `#FFFFFF` (white)

---

## Store Assets

- **Feature Graphic**: Centered Homies logo with 'HOMIES' and 'MEN KI BAAT' on the textured sage green background.
  - File: `.agents/feature_graphic.png`
  - Dimensions: 1024 x 500 px (exactly matches Google Play Store dimensions)

---

## Contact

- **Developer Email**: sadik@homies.support

---

## Google Play Console

- **Account Name**: Homies Support
- **Account Type**: Organization
- **Account ID**: 6415761054416267382

---

## Website Content (homies.support)

### Tagline
> "Connect with Homies - Men Ki Baat who understand"

### Description
A safe, anonymous community built for men to share their struggles and get expert advice and connect with people who truly care. You're never alone.

### Mission
Society tells men to be tough. But the truth is different:
- 70% of suicides in India are men
- Most men feel they "can't talk"
- Emotional struggles remain hidden
- Practical pressures feel overwhelming

### Key Features
- **Expert Consultations** — Verified psychologists, legal advisors, financial experts, and certified coaches
- **Anonymous Discussions** — Moderated group circles, speak freely without judgment
- **Complete Anonymity with Homie ID** — No real names; Face ID and PIN lock for private access
- **Holistic Support** — Mental health, career, relationships, money, and legal concerns in one place
- **Speak Now** — Connect with available doctors and experts in difficult moments
- **Face Verification** — Keeps community secure while maintaining anonymity
- **Interest-Based Matching** — Connect with members sharing similar experiences
- **Smart Notifications** — Updates on replies, follows, and expert posts

### Target Users
Men who have ever said "I am fine" when they weren't:
- Feeling burnt out or overwhelmed
- Struggling with a breakup or marriage
- Career pressure or feeling directionless
- Money stress or debt issues
- Family conflicts or loneliness
- Legal troubles
- Wanting to grow emotionally

### Supported By
Mission Men's Commission

### Footer Links
- https://homies.support/about
- https://homies.support/privacy
- https://homies.support/terms
- https://homies.support/contact

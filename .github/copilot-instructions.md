# Copilot Instructions for my-practice-sandbox

## Project Overview
Expo + React Native 연습용 프로젝트. Expo Router, Emotion Native, React Query, Push Notifications를 활용한 모바일 앱 개발 샌드박스.

## Architecture & Key Patterns

### 1. Routing: Expo Router (File-based)
- `app/` 폴더 = 라우팅 구조 (Next.js와 유사)
- `app/(tabs)/` = 탭 네비게이션 그룹
- 화면 파일들은 **단순 re-export만 수행**: `export default PracticeScreen;`
- 실제 화면 로직은 `src/features/*/screens/` 에 위치

**예시**: `app/(tabs)/practice.tsx` → `src/features/practice/screens/PracticeScreen.tsx`

### 2. Feature-Sliced Architecture
```
src/features/{feature}/
  ├── api/          # React Query hooks (useGet*, usePost*)
  ├── components/   # Feature 전용 컴포넌트
  └── screens/      # 화면 컴포넌트 (PascalCase + "Screen" suffix)
```

**규칙**:
- API 호출은 `src/features/*/api/`에 React Query 훅으로 작성
- 내부 fetch 함수는 export하지 않음 (예: `fetchPosts`)
- 훅만 export (예: `export const useGetPosts = () => useQuery(...)`)

### 3. Styling: Emotion Native
- `@emotion/native`의 `styled` API 사용 (NOT styled-components)
- **필수**: `babel.config.js`에 `@emotion/babel-plugin` 포함됨
- 테마는 `src/lib/theme.ts`에 정의, `app/_layout.tsx`에서 `<ThemeProvider>` 적용
- 컴포넌트에서 테마 접근: `${props => props.theme.colors.primary}`

**예시**:
```tsx
const Title = styled.Text`
  color: ${props => props.theme.colors.primary};
`;
```

### 4. Global Providers (app/_layout.tsx)
최상위 provider 순서:
1. `QueryClientProvider` (React Query)
2. `ThemeProvider` (@emotion/react)
3. `Stack` (Expo Router)

## Development Workflows

### Starting the App
```bash
npm start          # Metro 번들러 시작
npm run ios        # iOS 시뮬레이터 실행
npm run android    # Android 에뮬레이터 실행
```

### Installing Expo-compatible Packages
```bash
npx expo install <package-name>  # Expo 호환 버전 자동 설치
```

### Path Aliases
`@/*` → `./src/*` (tsconfig.json에 정의됨)

**사용 예**: `import { theme } from '@/lib/theme';`

## Project-Specific Conventions

### 1. Push Notifications
- `src/hooks/usePushNotification.ts` = 커스텀 훅 (토큰 발급 + 알림 리스너)
- `Notifications.setNotificationHandler()` = 포그라운드 알림 설정 (파일 최상단에서 실행)
- 실제 기기 필수 (시뮬레이터에서는 토큰 발급 불가)

### 2. Tab Navigation Setup
새 탭 추가 시:
1. `app/(tabs)/new-tab.tsx` 생성 (feature screen re-export)
2. `app/(tabs)/_layout.tsx`에 `<Tabs.Screen name="new-tab" />` 등록
3. `title`, `tabBarIcon` 옵션 설정

### 3. Component Naming
- 화면 컴포넌트: `PascalCaseScreen` (예: `PracticeScreen`)
- 일반 컴포넌트: `PascalCase` (예: `PostCard`)
- 훅: `useCamelCase` (예: `useGetPosts`, `usePushNotification`)

### 4. TypeScript Strict Mode
- `tsconfig.json`에서 `"strict": true` 활성화
- Emotion 테마 타입은 `src/lib/theme.ts`에서 module augmentation으로 확장

## External Dependencies
- **API 호출**: Axios (React Query의 `queryFn`에서 사용)
- **Mock API**: JSONPlaceholder (`https://jsonplaceholder.typicode.com/posts`)
- **State Management**: Zustand (설치되어 있으나 현재 미사용)
- **Expo Modules**: expo-notifications, expo-clipboard, expo-device 등

## Common Pitfalls
1. **Emotion Native vs styled-components**: 이 프로젝트는 `@emotion/native`를 사용 (import 경로 주의)
2. **Expo Router 파일명**: `app/(tabs)/`의 파일명이 route path가 됨 (kebab-case 권장)
3. **Push Token**: `Constants.expoConfig?.extra?.eas?.projectId` 필요 (app.json 또는 EAS 설정)
4. **New Architecture**: `app.json`에서 `newArchEnabled: true` 설정됨 (Expo SDK 54 기준)

## Key Files to Reference
- `app/_layout.tsx` - Global providers 설정 예시
- `src/features/practice/api/useGetPosts.ts` - React Query 훅 패턴
- `src/features/practice/components/PostCard.tsx` - Emotion Native + 테마 사용 예시
- `src/hooks/usePushNotification.ts` - Expo Notifications 통합 예시

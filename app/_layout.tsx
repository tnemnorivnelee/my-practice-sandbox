import { ThemeProvider } from '@emotion/react'; // ⭐️ @emotion/react 임포트
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import React from 'react';

import { theme } from '@/lib/theme'; // ⭐️ 우리가 만든 테마 (경로 별칭 사용)

// 1. React Query 클라이언트 생성
const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    // 2. 전역 Provider 설정
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        {/* 3. Expo Router의 Stack (기존 Tabs 템플릿의 <Tabs>를 대체) */}
        {/* (이게 RootNavigator.tsx를 대체합니다.) */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          {/* (tabs) 폴더 전체를 하나의 화면으로 관리 */}
        </Stack>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

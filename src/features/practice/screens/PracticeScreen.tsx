// 📄 src/features/practice/screens/PracticeScreen.tsx
import styled from '@emotion/native';
import React from 'react';
import { ActivityIndicator, FlatList, Text } from 'react-native';

// ⭐️ 1. 우리가 만든 훅과 컴포넌트 임포트
import { useGetPosts } from '../api/useGetPosts';
import { PostCard } from '../components/PostCard';

// (화면 배경색 등 설정)
const ScreenContainer = styled.View`
  flex: 1;
  padding: 16px;
  background-color: #f0f0f0;
`;

export const PracticeScreen = () => {
  // ⭐️ 2. 훅 호출! (React Query가 API 호출/로딩/에러 관리)
  const { data: posts, isLoading, isError } = useGetPosts();

  // ⭐️ 3. 로딩 중 UI
  if (isLoading) {
    return (
      <ScreenContainer style={{ justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </ScreenContainer>
    );
  }

  // ⭐️ 4. 에러 발생 UI
  if (isError) {
    return (
      <ScreenContainer style={{ justifyContent: 'center' }}>
        <Text>데이터를 불러오는 데 실패했습니다!</Text>
      </ScreenContainer>
    );
  }

  // ⭐️ 5. 성공 시 UI (FlatList로 PostCard 렌더링)
  return (
    <ScreenContainer>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <PostCard title={item.title} body={item.body} />
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </ScreenContainer>
  );
};
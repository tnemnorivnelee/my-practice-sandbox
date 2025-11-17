// 📄 src/features/practice/screens/NotificationTest.tsx
import { usePushNotification } from '@/hooks/usePushNotification';
import styled from '@emotion/native';
import * as ExpoClipboard from 'expo-clipboard'; // npx expo install expo-clipboard
import React from 'react';
import { Button, Text } from 'react-native'; // Clipboard는 deprecated일 수 있으니 expo-clipboard 추천

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const TokenText = styled.Text`
  margin-top: 20px;
  margin-bottom: 20px;
  color: blue;
  font-size: 12px;
  text-align: center;
`;

export const NotificationTest = () => {
  const { expoPushToken } = usePushNotification();

  const copyToken = async () => {
    await ExpoClipboard.setStringAsync(expoPushToken);
    alert('토큰이 복사되었습니다!');
  };

  return (
    <Container>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>🔔 알림 테스트</Text>

      <Text style={{ marginTop: 20 }}>나의 Expo Push Token:</Text>
      <TokenText selectable>{expoPushToken || '토큰을 가져오는 중...'}</TokenText>

      <Button title="토큰 복사하기" onPress={copyToken} />
    </Container>
  );
};

// 📄 src/features/practice/components/PostCard.tsx
import styled from '@emotion/native';
import React from 'react';

// 1. Emotion으로 스타일링
const CardContainer = styled.View`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 12px;
  background-color: white;
  border-left-width: 4px;
  /* 2. ⭐️ theme.ts에 정의한 'primary' 색상 사용! */
  border-left-color: ${props => props.theme.colors.primary}; 
`;

const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  color: ${props => props.theme.colors.primary};
`;

const Body = styled.Text`
  font-size: 14px;
  color: #333;
  margin-top: 8px;
`;

// 3. props로 데이터를 받아 UI 렌더링
export const PostCard = ({ title, body }: { title: string, body: string; }) => {
  return (
    <CardContainer>
      <Title>{title}</Title>
      <Body>{body}</Body>
    </CardContainer>
  );
};
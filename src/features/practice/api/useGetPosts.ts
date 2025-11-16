// 📄 src/features/practice/api/useGetPosts.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios'; // ⭐️ Axios 임포트

// (가짜 포스트 데이터의 타입)
interface Post {
  id: number;
  title: string;
  body: string;
}

// 1. (내부 구현) API 호출 함수 (export 안 함)
const fetchPosts = async (): Promise<Post[]> => {
  // ⭐️ 가짜 API (JSONPlaceholder) 호출
  const { data } = await axios.get('https://jsonplaceholder.typicode.com/posts?_limit=10');
  return data;
};

// 2. (외부 공개) React Query 훅 (export 함)
export const useGetPosts = () => {
  return useQuery({
    queryKey: ['posts'], // 'posts'라는 이름으로 캐싱
    queryFn: fetchPosts, // 1번 함수를 실행
  });
};
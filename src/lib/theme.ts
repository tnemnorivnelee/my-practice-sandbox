// 📄 src/lib/theme.ts
export const theme = {
  colors: {
    primary: '#007AFF', // (연습용) 한세 블루
    background: '#FFFFFF',
    text: '#000000',
  },
};

// Emotion 테마 타입을 위한 설정
type AppTheme = typeof theme;
declare module '@emotion/react' {
  export interface Theme extends AppTheme { }
}
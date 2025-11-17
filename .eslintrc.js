module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Prettier 규칙을 어기면 에러로 표시
  },
};

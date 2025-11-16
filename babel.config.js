module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      '@emotion/babel-plugin', // ⬅️ "한세로" 스택을 위한 필수 플러그인
    ],
  };
};
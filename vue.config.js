module.exports = {
  //baseUrl: "./",
  devServer: {
    port: 6060,
    proxy: {
      "/api/*": {
        target: "http://114.116.71.3:8080",
        ws: true,
        changeOrigin: true
      }
    }
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.scss` 这个文件
        data: `@import "@/assets/css/color.scss";`
      }
    }
  }
};

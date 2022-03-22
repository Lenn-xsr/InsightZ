module.exports = {
  productionSourceMap: false,
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:80",
        changeOrigin: true,
      },
    },
  },
};

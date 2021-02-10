module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:8888/",
        pathRewrite: { "^/api/": "" },
        changeOrigin: true,
        logLevel: "debug"
      }
    }
  }
};

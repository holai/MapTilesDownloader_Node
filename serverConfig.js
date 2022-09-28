/*
 * @Description:
 * @Date: 2021-12-01 09:50:53
 * @LastEditTime: 2022-07-19 10:06:26
 * @Author: Lu
 */

module.exports = {
  /**
   * port-服务启动的端口
   */
  port: 5000,

  /**
   * 代理的配置-可以设置多个代理
   * @param key - 代理的匹配路径
   * target-代理的目标地址
   * changeOrigin-是否改变来源
   * ws-是否支持socket
   * pathRewrite-路径重写
   */
  proxy: {
    "/": {
      // target:"http://192.168.24.180",
      // target:"http://zhougs.com",
      // target:"http://work.com",
      // target:"http://zhougs.paint-future.cn",
      // target:"http://zjy.paint-future.cn",
      // target:"http://center.paint-future.cn",
      // target:"http://center.paint-future.com",
      // target:"http://facein.paint-future.cn",
      // target:"http://show.future-next.cn",
      // target:"https://smartlock.hnjmxy.cn",
      // target:"http://smartlock.hnjmxy.cn",
      // target:"http://oa.future-next.cn",
      // target:"http://byf.server.com",
      // target:"http://zmw.com",
      // target:"https://answers.hnjmxy.cn",
      // target:"http://sg.git.com",
      target: "https://api.mapbox.com",
      //   v4/mapbox.mapbox-terrain-v2,mapbox.mapbox-bathymetry-v2,mapbox.mapbox-streets-v8/16/54892/26755.vector.pbf?sku=101U5LFnnCSNA&access_token=pk.eyJ1IjoiaG91bGFpZGVsdWEiLCJhIjoiY2w4bDlpZngzMGtxcTN1cDRnNG9qcDdyYSJ9.MtgwgbUiI4dtw6WY-sxyOQ
      changeOrigin: true,
      ws: true,
      pathRewrite: {},
      onProxyRes: async (proxyRes) => {
        // proxyRes.headers['access-control-allow-origin'] = 'http://192.168.24.8';
        // proxyRes.headers['access-control-allow-origin'] = 'http://www.lzw.com';
      },
      onProxyReq: async (proxyReq, req, res) => {
        proxyReq.setHeader(
          "Referer",
          "https://api.mapbox.com/styles/v1/houlaidelua/cl8lakdzv000616p4hjcd4cl7.html?title=view&access_token=pk.eyJ1IjoiaG91bGFpZGVsdWEiLCJhIjoiY2w4bDlpZngzMGtxcTN1cDRnNG9qcDdyYSJ9.MtgwgbUiI4dtw6WY-sxyOQ&zoomwheel=true&fresh=true"
        );
        proxyReq.setHeader(
          "User-Agent",
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36"
        );
      },
    },
  },
};

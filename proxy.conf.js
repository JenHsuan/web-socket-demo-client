const PROXY_CONFIG = {
  "/stream/*": {
    "target": "http://localhost:3000",
    "changeOrigin": true,
    "secure": false,
    "ws": true
  }
};

module.exports = PROXY_CONFIG;
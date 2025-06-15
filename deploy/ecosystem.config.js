
module.exports = {
  apps : [{
    name: 'neptuneos-api',
    script: 'deploy/api-server.js',
    watch: false,
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    }
  }]
};

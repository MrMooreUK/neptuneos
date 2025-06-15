
module.exports = {
  apps : [{
    name: 'neptuneos-api',
    script: 'api-server.cjs',
    cwd: '/home/admin/neptuneos/deploy',
    watch: false,
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3001,
    },
    error_file: '/home/admin/.pm2/logs/neptuneos-api-error.log',
    out_file: '/home/admin/.pm2/logs/neptuneos-api-out.log',
    log_file: '/home/admin/.pm2/logs/neptuneos-api-combined.log',
    merge_logs: true,
    time: true,
    restart_delay: 5000,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};

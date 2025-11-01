module.exports = {
  apps: [{
    name: 'nextute-backend',
    cwd: '/root/Nextute-main/backend',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 8080
    },
    error_file: '/root/Nextute-main/backend/logs/error.log',
    out_file: '/root/Nextute-main/backend/logs/out.log',
    log_file: '/root/Nextute-main/backend/logs/combined.log',
    time: true
  }]
};

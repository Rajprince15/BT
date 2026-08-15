module.exports = {
  apps: [
    {
      name: 'bhavita-api',
      script: 'dist/server.js',
      exec_mode: 'cluster',
      instances: 'max',
      max_memory_restart: '512M',
      env: { NODE_ENV: 'production' },
      out_file: 'logs/pm2-out.log',
      error_file: 'logs/pm2-err.log',
      merge_logs: true,
      time: true,
    },
  ],
};

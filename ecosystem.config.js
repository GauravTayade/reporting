// ecosystem.config.js
module.exports = {
  apps: [{
    name:
      'nextjs-app'
    ,
    script:
      'npm'
    ,
    args:
      'start'
    ,
    env: {
      NODE_ENV:
        'production'
      ,
    },
  },],
};
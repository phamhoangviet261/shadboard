module.exports = {
  apps: [
    {
      name: "shadboard",
      cwd: "/home/shiro/shadboard/full-kit",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      exec_mode: "cluster",
      instances: 2,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
}

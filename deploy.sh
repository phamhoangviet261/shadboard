#!/usr/bin/env bash
set -Eeuo pipefail

APP_DIR="/home/shiro/shadboard"
LOCK_FILE="/tmp/shadboard-deploy.lock"

exec 9>"$LOCK_FILE"
flock -n 9 || {
  echo "==> Another deploy is already running"
  exit 1
}

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

cd "$APP_DIR"

echo "==> Environment"
echo "USER: $(whoami)"
echo "PWD: $(pwd)"
echo "NODE: $(which node || true)"
echo "PNPM: $(which pnpm || true)"
node -v
pnpm -v

echo "==> Pull latest code"
git fetch origin master
git reset --hard origin/master

echo "==> Install dependencies"
pnpm install --frozen-lockfile

echo "==> Build"
NODE_OPTIONS="--max-old-space-size=2048" pnpm build

echo "==> Reload PM2"
pm2 reload ecosystem.config.cjs --only shadboard

echo "==> Done"

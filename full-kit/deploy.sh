#!/usr/bin/env bash
set -e

cd /home/shiro/shadboard/full-kit

echo "==> Pull latest code"
git pull origin main

echo "==> Install dependencies"
pnpm install --frozen-lockfile

echo "==> Build"
pnpm build

echo "==> Reload PM2"
pm2 reload ecosystem.config.cjs --only shadboard

echo "==> Done"

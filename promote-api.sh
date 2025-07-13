#!/usr/bin/env bash
set -euo pipefail

TS=$(date +%Y%m%d-%H%M)
SRC="/home/hc477/MVP-files-hc477"
DEST="/home/hc477/IT490-group/IT490-master/api"
BACKUP_ROOT="/backups/api"

sudo mkdir -p "$BACKUP_ROOT/$TS"
sudo rsync -a "$DEST/" "$BACKUP_ROOT/$TS/"
sudo rsync -a --checksum "$SRC/" "$DEST/"
sudo systemctl restart api-server.service

for i in {1..5}; do
  if nc -z localhost 3000; then
    break
  fi
  sleep 1
done

if ! curl -fs http://localhost:3000/api/questions; then
  exit 1
fi

if ! curl -fs http://localhost:3000/api/participate; then
  exit 2
fi

echo "Promotion successful at $TS"
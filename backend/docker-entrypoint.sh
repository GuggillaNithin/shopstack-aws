#!/bin/sh
set -e

# Run Prisma migrations safely (deploy only runs pending migrations, doesn't reset DB)
echo "Running Prisma Migrations safely..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"

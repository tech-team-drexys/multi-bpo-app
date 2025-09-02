FROM node:18-alpine

WORKDIR /app

# Copy package files and pnpm lockfile
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install pnpm globally (ou use corepack como alternativa)
RUN npm install -g pnpm

# Install dependencies using pnpm with optimization flags
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the optimized application
RUN pnpm run build

# Set production environment
ENV NODE_ENV=production

EXPOSE 3000

# Run the Next.js production server
CMD ["pnpm", "run", "start"]

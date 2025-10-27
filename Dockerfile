FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# List the contents of .next directory to debug
RUN ls -la .next/
RUN ls -la .next/static/ || echo "No static directory found"

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 8080

# Start the application using the standalone server
CMD ["node", "server.js"]

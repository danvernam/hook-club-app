FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code (excluding custom server.js since we'll use standalone)
COPY . .
RUN rm -f server.js

# Build the application
RUN npm run build

# List the contents of .next directory to debug
RUN ls -la .next/
RUN ls -la .next/standalone/ || echo "No standalone directory found"
RUN ls -la .next/static/ || echo "No static directory found"

# Copy the standalone build to the working directory
RUN cp -r .next/standalone/* ./

# Copy static files to the correct location for standalone server
RUN cp -r .next/static .next/

# Remove dev dependencies
RUN npm prune --production

# Expose port
EXPOSE 8080

# Start the application using the Next.js standalone server
CMD ["node", "server.js"]

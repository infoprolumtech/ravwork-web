# Use official Node.js 20 image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Use npm ci for clean, reproducible install
RUN npm ci

# Copy the full source code
COPY . .

# Create non-root user and assign permissions
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the port your app runs on
EXPOSE 5173

# Run the app in development mode with host binding
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Dockerfile for Node.js Express App
# Author: Kirandeep
# This Dockerfile sets up a Node.js environment to run an Express application.

# Use official Node.js 16 Alpine image for smaller size and security
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy only package manifests first for better build cache
COPY package*.json ./

# Install only production dependencies for smaller image
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose the port the app will listen on
EXPOSE 8080

# Start the application
CMD ["node", "app.js"]

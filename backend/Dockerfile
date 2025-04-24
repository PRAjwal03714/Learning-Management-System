# backend/Dockerfile
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Expose port (e.g., 5000)
EXPOSE 5001

# Start server
CMD ["npm", "start"]

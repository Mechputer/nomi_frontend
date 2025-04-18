# Start with Node.js image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY ./contents/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY ./contents /app

# Expose port 3000 for Express server
EXPOSE 3000

# Start server
CMD ["node", "server.js"]

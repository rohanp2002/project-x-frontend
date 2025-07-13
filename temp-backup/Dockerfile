# Use an official Node.js runtime
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Bundle app source
COPY . .

# Expose the dev port
EXPOSE 3000

# Start the dev server
CMD ["npm", "run", "dev"]

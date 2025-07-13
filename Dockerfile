# Use a lightweight Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy source code
COPY . .

# Expose the dev port
EXPOSE 3000

# Start Next.js dev server
CMD ["npm", "run", "dev"]

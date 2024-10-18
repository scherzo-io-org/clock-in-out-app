# Use the official Node.js 20.2.0 image.
FROM node:20.2.0-alpine

# Set working directory.
WORKDIR /app

# Install dependencies.
COPY package*.json ./
RUN npm install

# Copy the rest of the application code.
COPY . .

# Build the Next.js app.
RUN npm run build

# Expose the port Next.js runs on.
EXPOSE 3000

# Start the Next.js app.
CMD ["npm", "run", "start"]

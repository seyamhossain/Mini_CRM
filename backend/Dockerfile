# Use official Node.js image as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all other files to the container
COPY . .

# Expose the API port (adjust accordingly if different)
EXPOSE 5000

# Run the application
CMD ["npm", "start"]

# Use an official Node.js runtime as a parent image
FROM node:20.16.0

# Define environment variable
ENV PORT=8080

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install any dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile TypeScript code to JavaScript
RUN npm run build

# Make the port available to the world outside this container
EXPOSE $PORT

# Define the command to run the application
CMD ["npm", "start"]

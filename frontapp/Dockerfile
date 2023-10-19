# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory inside the container
WORKDIR /frontapp

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the entire application directory to the container
COPY . .

# Build your React application
RUN npm run build

# Expose the port that the React app will run on (typically 3000)
EXPOSE 4000

# Define the command to start the React application
CMD ["npm", "start"]

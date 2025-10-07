# Stage 1: Build the React application
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Add build argument for environment
ARG BUILD_ENV=production

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Clean up node_modules and package-lock.json if they exist
RUN rm -rf node_modules package-lock.json

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Remove all environment files first
RUN rm -f .env .env.*

# Copy the environment-specific file to .env
COPY .env.${BUILD_ENV} .env

# Build the React application
RUN npm run build

# Stage 2: Serve the React application using nginx
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx-infra/default.conf /etc/nginx/conf.d/default.conf

# Copy the built React files from the builder stage to the nginx HTML folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx server
CMD ["nginx", "-g", "daemon off;"]
# Use a lightweight Node.js base image for ARMv6
FROM arm64v8/node:18-alpine AS arm

# Install required packages
RUN apk add --no-cache bind-tools curl iputils traceroute

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Use a lightweight Node.js base image for x86_64
FROM node:18-alpine AS x86

# Install required packages
RUN apk add --no-cache bind-tools curl iputils traceroute

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available)
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the port (if applicable, for this app you might not need this)
# EXPOSE 8080

# Set the environment variables (you can also pass these in the Kubernetes Deployment)
#ENV DOMAIN=example.com
#ENV SUBDOMAIN=www
#ENV PORKBUN_API_KEY=<api_key>
#ENV PORKBUN_SECRET_KEY=<secret_key
#ENV INTERVAL=60000
#ENV INITIAL_IP=<initial_ip>

# Command to run the DDNS client
CMD ["node", "ddns-client.js"]

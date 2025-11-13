#
# Multi-stage Dockerfile to build and serve the React frontend.
# The build stage produces the optimized CRA bundle and the final
# Nginx stage serves the static assets.
#

# Install dependencies and build the production bundle
FROM node:20-alpine AS build
WORKDIR /app

# Install exact dependencies based on package-lock.json
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# Allow overriding the API base URL during build time
ARG REACT_APP_API_BASE_URL="https://app-billzynergy-backend-dev.azurewebsites.net"
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

# Build optimized static assets
RUN npm run build

# Use Nginx to serve the static content
FROM nginx:1.27-alpine AS runtime

# Provide SPA-friendly routing configuration
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Copy the compiled frontend build
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

# Leverage the default Nginx start command
CMD ["nginx", "-g", "daemon off;"]

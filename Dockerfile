# Stage 1: Build React frontend
FROM node:18 AS build-client
WORKDIR /app
COPY client/package*.json client/
RUN cd client && npm install
COPY client client
RUN cd client && npm run build

# Stage 2: Prepare backend
FROM node:18 AS build-server
WORKDIR /app
COPY server/package*.json server/
RUN cd server && npm install
COPY server server

# Stage 3: Final image
FROM node:18
WORKDIR /app

# Copy backend code
COPY --from=build-server /app/server ./server

# Copy built frontend into backend’s public folder
COPY --from=build-client /app/client/dist ./server/public

WORKDIR /app/server
EXPOSE 5000
CMD ["node", "server.js"]

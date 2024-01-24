# Stage 1: Build the application
FROM node:18 as builder
RUN npm install -g npm@10.2.5
WORKDIR /usr/src/app
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the application from a lean production image
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
CMD [ "npm" ,"run" , "start:prod" ]
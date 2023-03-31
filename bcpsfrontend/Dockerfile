FROM node:alpine

WORKDIR /app/bcpsfrontend

COPY package.json .

# Makes sure npm is up to date otherwise install dependencies attempts will fail
RUN npm install -g npm

# Install dependencies
RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]
FROM node:20-slim

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY run.sh .
# COPY ./examples/fib.json /var/rinha/source.rinha.json

COPY ./dist ./dist

# CMD [ "bash", "./run.sh" ]
CMD [ "node", "dist/main.js" ]

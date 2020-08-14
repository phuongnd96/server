FROM node:latest
WORKDIR /node_server
COPY  package.json /node_server
RUN npm install
COPY . /node_server
EXPOSE 3000
# cần viết entry point ở đây
CMD ["node","server.js","3000"]
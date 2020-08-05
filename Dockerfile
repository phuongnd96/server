FROM node:latest
WORKDIR /node_server
COPY . .
RUN npm install
# cần viết entry point ở đây
CMD ["cd","auth_api","npm","run","Webserver.js","3000"]
# build environment
FROM node:14

WORKDIR /app
# ENV PATH /app/node_modules/.bin:$PATH

COPY ./ ./

RUN npm install

ENV PORT 44333
EXPOSE 44333

CMD ["npm", "start"]

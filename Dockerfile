FROM orctom/node:4.3.1

COPY . /site
WORKDIR /site
RUN \
  npm install

EXPOSE 3000

CMD ["npm", "start"]

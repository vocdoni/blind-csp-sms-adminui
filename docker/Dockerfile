FROM node:16 as builder

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ARG API_BASE
ENV REACT_APP_API_BASE=${API_BASE}
ARG EXPLORER
ENV REACT_APP_EXPLORER=${EXPLORER}
ARG KECCAK_SALT
ENV REACT_APP_KECCAK_SALT=${KECCAK_SALT}

WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm i --production=false

ADD . /app
RUN npm run build

FROM nginx:1.23

ADD docker/nginx.conf /etc/nginx/
COPY --from=builder /app/build /usr/share/nginx/html

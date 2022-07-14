FROM node:16 as builder

ARG NODE_ENV="production"
ENV NODE_ENV=${NODE_ENV}
ARG API_BASE
ENV REACT_APP_API_BASE=${API_BASE}
ARG KECCAK_SALT
ENV REACT_APP_KECCAK_SALT=${KECCAK_SALT}

WORKDIR /app
ADD package.json package-lock.json /app/
RUN npm ci

ADD . /app
RUN npm run build

FROM nginx:1.23

COPY --from=builder /app/build /usr/share/nginx/html

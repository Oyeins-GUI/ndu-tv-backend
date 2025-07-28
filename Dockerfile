FROM node:22.16.0-alpine

WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install -g pnpm

# RUN pnpm install 

# COPY . .

# EXPOSE 3100


COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

EXPOSE 3100

CMD ["pnpm", "run", "start:dev"]
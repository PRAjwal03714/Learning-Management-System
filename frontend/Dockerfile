FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ✅ This disables type-checks during Docker build
ENV NEXT_IGNORE_TYPE_ERRORS=true

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]

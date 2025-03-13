FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .   

EXPOSE 3000

# CMD ["npx", "tsx", "index.js"]
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx watch index.ts"]
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY prisma ./prisma
RUN npx prisma generate
COPY src ./src
ENV PORT=5001
ENV DATABASE_URL=file:/data/smartshop.db
EXPOSE 5001
RUN mkdir -p /data
CMD ["node", "src/index.js"]

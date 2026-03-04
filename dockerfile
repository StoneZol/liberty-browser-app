FROM node:24-alpine AS builder

WORKDIR /app

# Копируем только файлы с зависимостями
COPY package.json package-lock.json ./

# Устанавливаем зависимости для сборки
RUN npm install

# Копируем остальной код
COPY . .

# Собираем проект в папку dist
RUN npm run build

# ---------------- ФИНАЛЬНЫЙ ОБРАЗ ----------------
FROM nginx:alpine AS runner

# Копируем только собранный фронтенд
COPY --from=builder /app/dist /usr/share/nginx/html

# (опционально) если нужно, можно пробросить порт 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
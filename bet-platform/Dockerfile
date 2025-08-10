# Используем официальный Node.js образ с версией 18
FROM node:18

# Создаём рабочую директорию внутри контейнера
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json (если есть) для установки зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем весь код проекта в контейнер
COPY . .

# Компилируем TypeScript (если нужен)
RUN npm run build

# Указываем порт, который будет слушать приложение
EXPOSE 3000

# Команда для запуска приложения (предположим, что у тебя скрипт start в package.json)
CMD ["npm", "start"]

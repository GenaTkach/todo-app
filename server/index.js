// 1. Импорт нужных библиотек
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const taskRoutes = require('./routes/tasks');

// 2. Создание приложения
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Middleware
app.use(cors()); // разрешаем frontend'у делать запросы
app.use(express.json()); // парсим JSON в запросах (например, POST)

// Роуты
app.use("/api/tasks", taskRoutes);

// 4. Подключение к MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/todoapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Подключено к MongoDB"))
  .catch((err) => console.error("❌ Ошибка подключения к MongoDB:", err));

// 6. Запуск сервера
app.listen(PORT, () => {
  console.log(`🚀 Сервер запущен: http://localhost:${PORT}`);
});

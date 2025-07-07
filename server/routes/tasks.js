const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
} = require("../controllers/taskController");

// Получить все задачи
router.get("/", getTasks);

// Создать задачу
router.post("/", createTask);

// Удалить задачу
router.delete("/:id", deleteTask);

// Обновить задачу
router.put("/:id", updateTask);

module.exports = router;

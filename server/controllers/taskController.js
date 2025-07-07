const Task = require("../models/Task");

// Получить все задачи
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Ошибка при получении задач" });
  }
};

// Создать новую задачу
const createTask = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      completed: false,
      priority: req.body.priority
    });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при создании задачи" });
  }
};

// Удалить задачу
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await Task.findByIdAndDelete(id);
    res.json({ message: "Задача удалена" });
  } catch (error) {
    res.status(500).json({ message: "Ошибка при удалении задачи" });
  }
};

// Обновить задачу
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ message: "Ошибка при обновлении задачи" });
  }
};

module.exports = {
  getTasks,
  createTask,
  deleteTask,
  updateTask,
};

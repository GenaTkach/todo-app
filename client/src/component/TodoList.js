import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/TodoList.css";
import PriorityBadge from "./PriorityBadge";


const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState();
  const [priority, setPriority] = useState("regular");
  const [editTaskId, setEditTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("regular"); // или "" по умолчанию

  <PriorityBadge priority={tasks.priority} />

  // Загрузка задач при загрузке компонента
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tasks")
      .then((res) => {
        const sorted = res.data.sort((a, b) => {
          const priorityOrder = { high: 0, regular: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        setTasks(sorted);
      })
      .catch((err) => console.error(err));
  }, []);

  // Добавление новой задачи
  const addTask = () => {
    if (title == null) {
      return;
    }
    if (!title.trim()) return;

    axios
      .post("http://localhost:5000/api/tasks", { title, priority })
      .then((res) => {
        const newTasks = [...tasks, res.data];

        // Сортировка по приоритету после добавления новой задачи
        const sorted = newTasks.sort((a, b) => {
          const priorityOrder = { high: 0, regular: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });

        setTasks(sorted);
        setTitle("");
        setPriority("regular"); // если хочешь сбросить после добавления
      })
      .catch((err) => console.error(err));
  };

  // Удаление задачи
  const deleteTask = (id) => {
    axios
      .delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.error(err));
  };

  // Обновлене задачи
  const editTask = (id) => {
    axios
      .patch(`http://localhost:5000/api/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => console.error(err));
  };

  const startEditing = (task) => {
    setEditTaskId(task._id); // включаем режим редактирования
    setTitle(task.title); // это мы добавим чуть позже
    setPriority(task.priority); // тоже позже добавим
  };

  const toggleCompleted = (task) => {
    console.log("toggleCompleted started");
    console.log("task._id", task._id);
    axios
      .put(`http://localhost:5000/api/tasks/${task._id}`, {
        completed: !task.completed,
      })
      .then((res) => {
        console.log("Completed");
        setTasks(tasks.map((t) => (t._id === task._id ? res.data : t)));
      })
      .catch((err) => {
        console.error("Ошибка при обновлении:");
        if (err.response) {
          console.error("Ответ от сервера:", err.response.data);
        } else {
          console.error("Ошибка без ответа от сервера:", err.message);
        }
      });
  };

  return (
    <div className="todo-container">
      <h1>Yo</h1>
      <div className="input-container">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Create task"
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          className="todo-input"
        />
        <select
          name="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="todo-input"
        >
          <option value="high">High</option>
          <option value="regular">Regular</option>
          <option value="low">Low</option>
        </select>
        <button onClick={addTask} className="todo-button">
          Add task
        </button>
      </div>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {tasks.map((task) => (
          <li key={task._id} className="todo-list-item">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />
            <span className={`task-text ${task.completed ? "completed" : ""}`}>
              {task.title}
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
            </span>
            <button
              onClick={() => deleteTask(task._id)}
              className="todo-button"
            >
              Remove
            </button>
            <button onClick={() => startEditing(task)} className="edit-button">
              Edit
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;

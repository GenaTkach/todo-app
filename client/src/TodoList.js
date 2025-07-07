import React, { useEffect, useState } from "react";
import axios from "axios";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setText] = useState();
  const [priority, setPriority] = useState("regular");

  // 👇 Вставь сюда
  const renderPriorityBadge = (priority) => {
    const styles = {
      high: {
        backgroundColor: "#dc3545", // красный
        color: "#fff",
      },
      regular: {
        backgroundColor: "#ffc107", // жёлтый
        color: "#000",
      },
      low: {
        backgroundColor: "#28a745", // зелёный
        color: "#fff",
      },
      badge: {
        padding: "3px 8px",
        borderRadius: "12px",
        fontSize: "12px",
        fontWeight: "bold",
        marginLeft: "10px",
        textTransform: "capitalize",
      },
    };

    return (
      <span style={{ ...styles.badge, ...styles[priority] }}>{priority}</span>
    );
  };

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
        setText("");
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
    <div style={styles.container}>
      <h1>Yo</h1>
      <div style={styles.inputContainer}>
        <input
          type="text"
          value={title}
          onChange={(e) => setText(e.target.value)}
          placeholder="Create task"
          onKeyDown={(e) => {
            if (e.key === "Enter") addTask();
          }}
          style={styles.input}
        />
        <form>
          <select
            name="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={styles.input}
          >
            <option value="high">High</option>
            <option value="regular">Regular</option>
            <option value="low">Low</option>
          </select>
        </form>
        <button onClick={addTask}>Add task</button>
      </div>

      <ul style={{ padding: 0, listStyle: "none" }}>
        {tasks.map((task) => (
          <li key={task._id} style={styles.listItem}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleCompleted(task)}
            />
            <span style={styles.text(task.completed)}>
              {task.title}
              {renderPriorityBadge(task.priority)}
            </span>
            <button style={styles.button} onClick={() => deleteTask(task._id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "50px auto",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f9f9f9",
    fontFamily: "Arial, sans-serif",
  },
  inputContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "10px 15px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  listItem: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  text: (completed) => ({
    textDecoration: completed ? "line-through" : "none",
    color: completed ? "#888" : "#000",
    flex: 1,
    marginLeft: "10px",
  }),
};

export default TodoList;

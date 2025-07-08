import logo from "./logo.svg";
import "./style/App.css";
import React from "react";
import TodoList from "./component/TodoList";
import DynamicBackground from "./component/DynamicBackground";

function App() {
  return (
    <div className="App">
      <DynamicBackground />
      <TodoList />
    </div>
  );
}

export default App;

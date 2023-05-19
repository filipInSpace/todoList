
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TodoLists from "./components/TodoLists";
import TodoItemDetails from "./components/TodoItemDetails";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoLists/>} />
        <Route path="/todo-lists/:todoListId/items/:id" element={<TodoItemDetails/>} />
      </Routes>
    </Router>
  );
};

export default App;

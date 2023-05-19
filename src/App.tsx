
import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TodoLists from "./components/TodoLists";


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TodoLists/>} />
      </Routes>
    </Router>
  );
};

export default App;
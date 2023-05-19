

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import TodoItem from "./TodoItem";

interface TodoList {
  id: number;
  name: string;
  items: ITodoItem[];
}

interface ITodoItem {
  id: number;
  title: string;
  free_text: string;
  completed: boolean;
  date: string;
  time: string;
}

type TodoListFormData = {
  name: string;
};

const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
});

const TodoLists: React.FC = () => {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [error, setError] = useState<string>("");
  const { register, handleSubmit, reset } = useForm<TodoListFormData>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    axios
      .get<TodoList[]>("https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists")
      .then((response) => {
        setTodoLists(response.data);
      });
  }, []);

  const handleAddTodoList = handleSubmit((formData) => {
    const newTodoList: TodoList = {
      id: todoLists.length + 1,
      name: formData.name,
      items: [],
    };

    axios
      .post<TodoList>(
        "https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists",
        newTodoList
      )
      .then((response) => {
        setTodoLists((prevTodoLists) => [
          ...prevTodoLists,
          response.data,
        ]); // Add the new todo list to the existing todo lists array
      });
    reset();
  });

  const handleDeleteTodoList = (todoListId: number) => {
    axios
      .get<ITodoItem[]>(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items`)
      .then((response) => {
        const itemIds = response.data.map((item) => item.id);
        itemIds.forEach((id) => {
          axios.delete(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items/${id}`);
        });
        axios
          .delete(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}`)
          .then(() => {
            setTodoLists((prevTodoLists) =>
              prevTodoLists.filter((todoList) => todoList.id !== todoListId)
            );
          });
      });
  };

  return (
    <div className="bg-gray-100 py-6 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo Lists</h1>
      <div className="flex flex-wrap justify-center">
        {todoLists.map((todoList) => (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 mr-6" key={todoList.id}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 todo-list-name">{todoList.name}</h2>
              <button className="bg-red-600 text-white rounded-lg px-4 py-2 hover:bg-red-700 focus:outline-none" onClick={() => handleDeleteTodoList(todoList.id)}>Delete</button>
            </div>
            <ul className="mt-4 flex flex-col">
              {todoList.items.map((item) => (
                <TodoItem todoListId={todoList.id} key={item.id} />
              ))}
            </ul>
            <TodoItem todoListId={todoList.id} />
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTodoList} className="mt-6 flex flex-col sm:flex-row">
        <input
          className="rounded-lg border-gray-400 border-2 p-2 w-full sm:w-auto mb-2 sm:mb-0 sm:mr-2 focus:outline-none focus:border-primary"
          type="text"
          {...register("name")}
          placeholder="To-do List Name"
        />
        <button className="bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-400 focus:outline-none" type="submit">Add Todo List</button>
        <p className="text-red-600 mt-2">{error}</p>
      </form>
    </div>
);
};

export default TodoLists;

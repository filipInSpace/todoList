
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
    <div>
      <h1>Todo Lists</h1>
      <div>
        {todoLists.map((todoList) => (
          <div key={todoList.id}>
            <div>
              <h2>{todoList.name}</h2>
              <button onClick={() => handleDeleteTodoList(todoList.id)}>Delete</button>
            </div>
            <ul>
              {todoList.items.map((item) => (
                <TodoItem todoListId={todoList.id} key={item.id} />
              ))}
            </ul>
            <TodoItem todoListId={todoList.id} />
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTodoList}>
        <input
          type="text"
          {...register("name")}
          placeholder="To-do List Name"
        />
        <button type="submit">Add Todo List</button>
        <p>{error}</p>
      </form>
    </div>
);
};

export default TodoLists;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface ITodoItem {
  id: number;
  title: string;
  free_text: string;
  completed: boolean;
  date: string;
  time: string;
}

interface TodoList {
    id: number;
    name: string;
    items: ITodoItem[];
  }

type RouteParams = {
  [key: string]: string | undefined;
};  

const TodoItemDetails: React.FC = () => {
  const { id, todoListId } = useParams<RouteParams>();
  const [todoItem, setTodoItem] = useState<ITodoItem | null>(null);

  useEffect(() => {
    axios
      .get<ITodoItem>(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items/${id}`)
      .then((response) => {
        setTodoItem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [id, todoListId]);

  if (!todoItem) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center h-screen">
  <div className="bg-white rounded-lg shadow-md p-6 mb-6 mr-6">
    <h4 className="font-bold">Title: </h4>
    <h1 className="text-lg text-gray-800 mb-4">{todoItem.title}</h1>
    <h4 className="font-bold">Free Text: </h4>
    <p className="text-gray-500 mb-2">{todoItem.free_text}</p>
    <h4 className="font-bold">Deadline: </h4>
    <p className="text-gray-500 mb-2">{todoItem.date}</p>
    <h4 className="font-bold">Deadline Time: </h4>
    <p className="text-gray-500 mb-2">{todoItem.time}</p>
    <h4 className="font-bold">Status: </h4>
    <p className={`text-lg font-bold ${todoItem.completed ? "text-green-500" : "text-red-500"}`}>
      {todoItem.completed ? "Completed" : "Not completed"}
    </p>
  </div>
</div>
  );
};

export default TodoItemDetails;

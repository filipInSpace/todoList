
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
    <div>
  <div>
    <h4 >Title: </h4>
    <h1 >{todoItem.title}</h1>
    <h4 >Free Text: </h4>
    <p >{todoItem.free_text}</p>
    <h4 >Deadline: </h4>
    <p >{todoItem.date}</p>
    <h4 >Deadline Time: </h4>
    <p >{todoItem.time}</p>
    <h4 >Status: </h4>
  </div>
</div>
  );
};

export default TodoItemDetails;

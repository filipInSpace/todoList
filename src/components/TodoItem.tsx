

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { Link } from "react-router-dom";

interface ITodoItem {
  id: number;
  title: string;
  free_text: string;
  completed: boolean;
  date: string;
  time: string;
}

interface Props {
  todoListId: number;
}

interface FormData {
  title: string;
  free_text: string;
  date: string;
  time: string;
}

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  free_text: yup.string().required("Free text is required"),
  date: yup.string().required("Date is required"),
  time: yup.string().required("Time is required"),
});

const TodoItem: React.FC<Props> = ({ todoListId }) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();
  const [todoItems, setTodoItems] = useState<ITodoItem[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState<string>("");


  useEffect(() => {
    axios
      .get<ITodoItem[]>(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items`)
      .then((response) => {
        setTodoItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [todoListId]);

  const onSubmit = async (data: FormData) => {
    try {
      await schema.validate(data, { abortEarly: false });
      const response = await axios.post<ITodoItem>(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items`, {
        ...data,
        completed: false,
      });
      console.log(response.data);
      setTodoItems([...todoItems, response.data]);
      setValue("title", "");
      setValue("free_text", "");
      setValue("date", "");
      setValue("time", "");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        console.log(error.errors);
      } else {
        console.log(error);
      }
    }
  };

  const handleComplete = async (id: number) => {
    const updatedItems = [...todoItems];
    const index = updatedItems.findIndex((item) => item.id === id);
    if (index > -1) {
      updatedItems[index].completed = !updatedItems[index].completed;
      await axios.put(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items/${id}`, updatedItems[index]);
      setTodoItems(updatedItems);
    }
  };

  const handleDeleteTodoItem = async (id: number) => {
    await axios.delete(`https://6425ff1f556bad2a5b47e151.mockapi.io/todo-lists/${todoListId}/items/${id}`);
    setTodoItems((prevTodoItems) =>
      prevTodoItems.filter((item) => item.id !== id)
    );
  };

  const filteredTodoItems = todoItems.filter((item) => {
    if (filter === "completed") {
      return item.completed;
    } else if (filter === "active") {
      return !item.completed;
    } else {
      return true;
    }
  }).filter((item) => {
    return item.title.toLowerCase().includes(search.toLowerCase());
  });  

  return (
    <>
      <ul className="border border-gray-300 p-4">
        <div className="flex items-center">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="border border-gray-300 p-2 rounded-l-md flex-1" placeholder="Search Todos" />
          <button onClick={() => setFilter("all")} className={`border border-gray-300 p-2 rounded-r-md ${filter === 'all' ? 'bg-blue-500 text-white' : ''}`}>All</button>
          <button onClick={() => setFilter("active")} className={`border border-gray-300 p-2 ${filter === 'active' ? 'bg-blue-500 text-white' : ''}`}>Active</button>
          <button onClick={() => setFilter("completed")} className={`border border-gray-300 p-2 rounded-r-md ${filter === 'completed' ? 'bg-blue-500 text-white' : ''}`}>Completed</button>
        </div>
        {filteredTodoItems.map((item) => (
          <li key={item.id} className="border-t border-gray-300 py-2 flex items-center">
            <input type="checkbox" checked={item.completed} onClick={() => handleComplete(item.id)} className="mr-2" />
            <span><Link to={`/todo-lists/${todoListId}/items/${item.id}`} className="font-medium text-gray-800">{item.title}</Link></span>
            <span className="text-gray-500 ml-2">{item.free_text}</span>
            <span className="text-gray-500 ml-2">{item.date}</span>
            <span className="text-gray-500 ml-2">{item.time}</span>
            <button onClick={() => handleDeleteTodoItem(item.id)} className="ml-auto border border-red-500 p-2 rounded-md text-red-500 hover:bg-red-500 hover:text-white">Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
        <input type="text" {...register("title")} className="border border-gray-300 p-2 rounded-md mr-2" placeholder="Enter Todo Title" />
        <input type="text" {...register("free_text")} className="border border-gray-300 p-2 rounded-md mr-2" placeholder="Enter Free Text" />
        <input type="date" {...register("date")} className="border border-gray-300 p-2 rounded-md mr-2" />
        <input type="time" {...register("time")} className="border border-gray-300 p-2 rounded-md mr-2" />
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-400">Add Todo Item</button>
      </form>
    </>
);
};

export default TodoItem;

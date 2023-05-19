
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
      <ul>
        <div className="flex items-center">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Todos" />
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("active")}>Active</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
        </div>
        {filteredTodoItems.map((item) => (
          <li key={item.id} >
            <input type="checkbox" checked={item.completed} onClick={() => handleComplete(item.id)}/>
            <span><Link to={`/todo-lists/${todoListId}/items/${item.id}`}>{item.title}</Link></span>
            <span>{item.free_text}</span>
            <span>{item.date}</span>
            <span>{item.time}</span>
              <button onClick={() => handleDeleteTodoItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="text" {...register("title")}  placeholder="Enter Todo Title" />
        <input type="text" {...register("free_text")}  placeholder="Enter Free Text" />
        <input type="date" {...register("date")}  />
        <input type="time" {...register("time")}  />
        <button type="submit">Add Todo Item</button>
      </form>
    </>
);
};

export default TodoItem;

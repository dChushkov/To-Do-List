import { useState, useEffect } from 'react';
import styles from './TodoList.module.css';

interface Todo {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });

  // Function to fetch all todos
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/todos');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  // Function to create a new todo
  const createTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo({ title: '', description: '' });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Function to delete a todo
  const deleteTodo = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'DELETE',
      });
      setTodos(todos.filter(todo => todo._id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // Function to toggle todo completion
  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: !completed }),
      });
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => 
        todo._id === id ? updatedTodo : todo
      ));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Load todos when component mounts
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className={styles.todoList}>
      <h2 className={styles.title}>Tasks</h2>
      
      {/* Form for creating new todo */}
      <form onSubmit={createTodo} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Title"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            className={styles.input}
          />
          <input
            type="text"
            placeholder="Description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Add Task</button>
        </div>
      </form>

      {/* List of todos */}
      <div className={styles.todos}>
        {todos.map((todo) => (
          <div key={todo._id} className={styles.todoItem}>
            <h3 className={styles.todoTitle}>{todo.title}</h3>
            <p className={styles.todoDescription}>{todo.description}</p>
            <p className={`${styles.todoStatus} ${todo.completed ? styles.statusCompleted : styles.statusActive}`}>
              {todo.completed ? 'Completed' : 'Active'}
            </p>
            <div className={styles.todoActions}>
              <button 
                onClick={() => toggleTodo(todo._id, todo.completed)}
                className={`${styles.actionButton} ${styles.completeButton}`}
              >
                {todo.completed ? 'Mark Active' : 'Mark Complete'}
              </button>
              <button 
                onClick={() => deleteTodo(todo._id)}
                className={`${styles.actionButton} ${styles.deleteButton}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TodoList; 
import axios from 'axios';
import { Task } from '../features/tasks/model/Task';

const BASE_URL = 'https://dummyjson.com';

// Respuesta de la API para la consulta de todos los todos, con paginación.
interface TodosResponse {
  todos: Task[];
  total: number;
  skip: number;
  limit: number;
}

// Función para obtener la lista de tareas desde la API, con un límite de 150 tareas.
export const fetchTodos = async (): Promise<Task[]> => {
  const response = await axios.get<TodosResponse>(`${BASE_URL}/todos?limit=150`);
  return response.data.todos;
};

import Realm from 'realm';
import { TaskSchema } from '../../../storage/TaskSchema';
import { fetchTodos } from '../../../api/todosApi';

/**
 * @description Sincroniza las tareas locales con las tareas obtenidas de la API.
 * @param realm Objeto Realm para acceder a la base de datos local.
 * @returns Promise que se resuelve cuando la sincronización con la API ha finalizado.
 */
export const syncTasksFromApi = async (realm: Realm): Promise<void> => {
  const tasks = await fetchTodos();
  realm.write(() => {
    tasks.forEach(task => {
      // Usamos create con UpdateMode.Modified para insertar o actualizar tareas según su ID.
      realm.create(TaskSchema, task, Realm.UpdateMode.Modified);
    });
  });
};

/**
 * @description Alterna el estado de completada/pending de una tarea específica en la base de datos local.
 * @param realm Objeto Realm para acceder a la base de datos local.
 * @param taskId ID de la tarea que se desea alternar su estado de completada/pending.
 * @returns void. La función no retorna ningún valor, pero actualiza el estado de la tarea en la base de datos local.
 */
export const toggleTaskCompletion = (realm: Realm, taskId: number): void => {
  // Se obtiene la tarea por su ID.
  const task = realm.objectForPrimaryKey(TaskSchema, taskId);
  if (!task) return;
  // Si la tarea existe, se modifica el estado de completada/pending.
  realm.write(() => {
    task.completed = !task.completed;
  });
};

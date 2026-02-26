import { useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { useQuery, useRealm } from '@realm/react';
import { TaskSchema } from '../../../storage/TaskSchema';
import { syncTasksFromApi, toggleTaskCompletion } from '../data/TaskRepository';
import { useTaskStore } from '../../../store/taskStore';

export const useTaskViewModel = () => {

  // Acceso a Realm.
  const realm = useRealm();

  // Acceso al estado global de tareas.
  const {
    filter,
    isSyncing,
    setFilter,
    setIsSyncing } = useTaskStore();

  // Consulta de todas las tareas para contar el total.
  const allTasks = useQuery(TaskSchema);

  // Consulta de tareas visibles según el filtro seleccionado.
  const visibleTasks = useQuery(
    {
      type: TaskSchema,
      query(collection) {
        if (filter === 'completed') return collection.filtered('completed == true');
        if (filter === 'pending') return collection.filtered('completed == false');
        return collection;
      },
    },
    [filter],
  );

  // Función para sincronizar tareas con la API.
  const syncTasks = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncTasksFromApi(realm);
    } catch (error: any) {
      const isNetworkError =
        error?.message === 'Network Error' ||
        error?.code === 'ECONNABORTED' ||
        error?.code === 'ERR_NETWORK' ||
        error?.code === 'ETIMEDOUT' ||
        !error?.response;

      if (isNetworkError) {
        Alert.alert(
          'Sin conexión',
          'No se pudo sincronizar. Verifica tu conexión a internet e intenta nuevamente.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Reintentar', onPress: syncTasks },
          ],
        );
      }
    } finally {
      setIsSyncing(false);
    }
  }, [realm, setIsSyncing]);

  // Sincronización inicial al montar el componente.
  useEffect(() => {
    // Si no hay tareas, intentamos sincronizar al inicio.
    if (allTasks.length === 0) {
      syncTasks();
    }
  }, []);

  // Función para alternar el estado de una tarea (completada/pending).
  const toggleTask = useCallback(
    (taskId: number) => {
      toggleTaskCompletion(realm, taskId);
    },
    [realm],
  );

  return {
    tasks: visibleTasks,
    totalCount: allTasks.length,
    filter,
    isSyncing,
    setFilter,
    syncTasks,
    toggleTask,
  };
};

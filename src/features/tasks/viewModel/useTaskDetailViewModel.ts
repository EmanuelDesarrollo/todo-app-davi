import { useCallback } from 'react';
import { useRealm, useObject } from '@realm/react';
import { TaskSchema } from '../../../storage/TaskSchema';
import { toggleTaskCompletion } from '../data/TaskRepository';

export const useTaskDetailViewModel = (taskId: number) => {
    const realm = useRealm();

    // Obtiene la tarea reactivamente por su primary key desde Realm.
    const task = useObject(TaskSchema, taskId);

    // Alterna el estado de completada/pendiente de la tarea.
    const toggleTask = useCallback(() => {
        toggleTaskCompletion(realm, taskId);
    }, [realm, taskId]);

    return { task, toggleTask };
};

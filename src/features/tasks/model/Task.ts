export interface Task {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
  userName?: string; // Campo opcional para almacenar el nombre del usuario asociado a la tarea
}

export type FilterType = 'all' | 'completed' | 'pending';

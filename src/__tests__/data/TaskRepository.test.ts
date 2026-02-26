import { syncTasksFromApi, toggleTaskCompletion } from '../../features/tasks/data/TaskRepository';
import { TaskSchema } from '../../storage/TaskSchema';
import { Task } from '../../features/tasks/model/Task';

// Mock del módulo todosApi para controlar las respuestas de la API
jest.mock('../../api/todosApi');
import { fetchTodos } from '../../api/todosApi';
const mockedFetchTodos = fetchTodos as jest.MockedFunction<typeof fetchTodos>;

// Fábrica de un realm simulado para pruebas
const createMockRealm = () => {
    const store = new Map<number, any>();

    return {
        _store: store,
        write: jest.fn((fn: () => void) => fn()),
        create: jest.fn((schema: any, data: any) => {
            const obj = { ...data };
            store.set(data.id, obj);
            return obj;
        }),
        objectForPrimaryKey: jest.fn((_schema: any, id: number) => store.get(id) ?? null),
    };
};

const MOCK_TASKS: Task[] = [
    { id: 1, todo: 'Comprar leche', completed: false, userId: 1 },
    { id: 2, todo: 'Hacer ejercicio', completed: true, userId: 2 },
];

describe('TaskRepository', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ── syncTasksFromApi ──────────────────────────────────────────────────
    describe('syncTasksFromApi', () => {
        it('llama a fetchTodos y guarda todas las tareas en Realm', async () => {
            const realm = createMockRealm();
            mockedFetchTodos.mockResolvedValueOnce(MOCK_TASKS);

            await syncTasksFromApi(realm as any);

            expect(mockedFetchTodos).toHaveBeenCalledTimes(1);
            expect(realm.write).toHaveBeenCalledTimes(1);
            expect(realm.create).toHaveBeenCalledTimes(MOCK_TASKS.length);
        });

        it('asigna un userName aleatorio a tareas sin nombre de usuario', async () => {
            const realm = createMockRealm();
            const tasksWithoutName: Task[] = [
                { id: 10, todo: 'Tarea sin nombre', completed: false, userId: 5 },
            ];
            mockedFetchTodos.mockResolvedValueOnce(tasksWithoutName);

            await syncTasksFromApi(realm as any);

            const createdTask = realm._store.get(10);
            expect(createdTask?.userName).toBeDefined();
            expect(typeof createdTask?.userName).toBe('string');
            expect(createdTask?.userName!.length).toBeGreaterThan(0);
        });

        it('conserva el userName si la tarea ya tiene uno asignado', async () => {
            const realm = createMockRealm();
            const taskWithName: Task[] = [
                { id: 20, todo: 'Tarea con nombre', completed: false, userId: 3, userName: 'Juan Pérez' },
            ];
            mockedFetchTodos.mockResolvedValueOnce(taskWithName);

            await syncTasksFromApi(realm as any);

            const createdTask = realm._store.get(20);
            expect(createdTask?.userName).toBe('Juan Pérez');
        });

        it('lanza el error si fetchTodos falla', async () => {
            const realm = createMockRealm();
            mockedFetchTodos.mockRejectedValueOnce(new Error('Network Error'));

            await expect(syncTasksFromApi(realm as any)).rejects.toThrow('Network Error');
            expect(realm.write).not.toHaveBeenCalled();
        });

        it('no llama a realm.write cuando no hay tareas', async () => {
            const realm = createMockRealm();
            mockedFetchTodos.mockResolvedValueOnce([]);

            await syncTasksFromApi(realm as any);

            expect(realm.write).toHaveBeenCalledTimes(1);
            expect(realm.create).not.toHaveBeenCalled();
        });
    });

    // ── toggleTaskCompletion ──────────────────────────────────────────────
    describe('toggleTaskCompletion', () => {
        it('cambia completed de false a true', () => {
            const realm = createMockRealm();
            realm._store.set(1, { id: 1, todo: 'Test', completed: false, userId: 1 });

            toggleTaskCompletion(realm as any, 1);

            expect(realm._store.get(1)?.completed).toBe(true);
        });

        it('cambia completed de true a false', () => {
            const realm = createMockRealm();
            realm._store.set(2, { id: 2, todo: 'Test', completed: true, userId: 1 });

            toggleTaskCompletion(realm as any, 2);

            expect(realm._store.get(2)?.completed).toBe(false);
        });

        it('no lanza error si la tarea no existe', () => {
            const realm = createMockRealm();

            expect(() => toggleTaskCompletion(realm as any, 999)).not.toThrow();
        });

        it('llama a realm.write cuando la tarea existe', () => {
            const realm = createMockRealm();
            realm._store.set(1, { id: 1, todo: 'Test', completed: false, userId: 1 });

            toggleTaskCompletion(realm as any, 1);

            expect(realm.write).toHaveBeenCalledTimes(1);
        });

        it('no llama a realm.write cuando la tarea no existe', () => {
            const realm = createMockRealm();

            toggleTaskCompletion(realm as any, 999);

            expect(realm.write).not.toHaveBeenCalled();
        });
    });
});

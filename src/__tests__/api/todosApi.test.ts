import axios from 'axios';
import { fetchTodos } from '../../api/todosApi';
import { Task } from '../../features/tasks/model/Task';

// Mock completo de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const MOCK_TASKS: Task[] = [
    { id: 1, todo: 'Comprar leche', completed: false, userId: 1 },
    { id: 2, todo: 'Hacer ejercicio', completed: true, userId: 2 },
    { id: 3, todo: 'Leer un libro', completed: false, userId: 1 },
];

describe('fetchTodos', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('retorna la lista de tareas cuando la API responde correctamente', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { todos: MOCK_TASKS, total: 3, skip: 0, limit: 150 },
        });

        const tasks = await fetchTodos();

        expect(tasks).toEqual(MOCK_TASKS);
        expect(tasks).toHaveLength(3);
    });

    it('llama al endpoint correcto con el límite de 150', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { todos: [], total: 0, skip: 0, limit: 150 },
        });

        await fetchTodos();

        expect(mockedAxios.get).toHaveBeenCalledWith(
            'https://dummyjson.com/todos?limit=150',
            expect.objectContaining({ timeout: 8000 }),
        );
    });

    it('llama a axios.get exactamente una vez', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { todos: MOCK_TASKS, total: 3, skip: 0, limit: 150 },
        });

        await fetchTodos();

        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    });

    it('lanza un error cuando la API falla', async () => {
        const networkError = new Error('Network Error');
        mockedAxios.get.mockRejectedValueOnce(networkError);

        await expect(fetchTodos()).rejects.toThrow('Network Error');
    });

    it('retorna lista vacía si la API responde con todos vacíos', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { todos: [], total: 0, skip: 0, limit: 150 },
        });

        const tasks = await fetchTodos();

        expect(tasks).toEqual([]);
    });

    it('usa timeout de 8000ms en la petición', async () => {
        mockedAxios.get.mockResolvedValueOnce({
            data: { todos: MOCK_TASKS, total: 3, skip: 0, limit: 150 },
        });

        await fetchTodos();

        const callOptions = mockedAxios.get.mock.calls[0][1];
        expect(callOptions?.timeout).toBe(8000);
    });
});

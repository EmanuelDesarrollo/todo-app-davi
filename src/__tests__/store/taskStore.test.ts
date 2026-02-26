import { useTaskStore } from '../../store/taskStore';

// Limpia el estado del store antes de cada prueba
beforeEach(() => {
    useTaskStore.setState({ filter: 'all', isSyncing: false });
});

describe('useTaskStore', () => {
    describe('estado inicial', () => {
        it('tiene filter "all" por defecto', () => {
            const { filter } = useTaskStore.getState();
            expect(filter).toBe('all');
        });

        it('tiene isSyncing false por defecto', () => {
            const { isSyncing } = useTaskStore.getState();
            expect(isSyncing).toBe(false);
        });
    });

    describe('setFilter', () => {
        it('actualiza el filtro a "completed"', () => {
            useTaskStore.getState().setFilter('completed');
            expect(useTaskStore.getState().filter).toBe('completed');
        });

        it('actualiza el filtro a "pending"', () => {
            useTaskStore.getState().setFilter('pending');
            expect(useTaskStore.getState().filter).toBe('pending');
        });

        it('vuelve al filtro "all"', () => {
            useTaskStore.getState().setFilter('pending');
            useTaskStore.getState().setFilter('all');
            expect(useTaskStore.getState().filter).toBe('all');
        });
    });

    describe('setIsSyncing', () => {
        it('activa el estado de sincronización', () => {
            useTaskStore.getState().setIsSyncing(true);
            expect(useTaskStore.getState().isSyncing).toBe(true);
        });

        it('desactiva el estado de sincronización', () => {
            useTaskStore.getState().setIsSyncing(true);
            useTaskStore.getState().setIsSyncing(false);
            expect(useTaskStore.getState().isSyncing).toBe(false);
        });
    });
});

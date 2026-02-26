import React, { useCallback } from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTaskViewModel } from '../viewModel/useTaskViewModel';
import TaskItem from '../../../components/TaskItem';
import FilterBar from '../../../components/FilterBar';
import { TaskSchema } from '../../../storage/TaskSchema';
import { TaskStackParamList } from '../../../navigation/types';

type DashboardNavProp = StackNavigationProp<TaskStackParamList, 'TaskDashboard'>;

const TaskDashboard = () => {

  const navigation = useNavigation<DashboardNavProp>();

  // Estados y logica de negocio encapsulados en el ViewModel
  const {
    tasks,
    totalCount,
    filter,
    isSyncing,
    setFilter,
    syncTasks,
    toggleTask } = useTaskViewModel();

  // Navega al detalle de la tarea seleccionada.
  const handleTaskPress = useCallback(
    (taskId: number) => {
      navigation.navigate('TaskDetail', { taskId });
    },
    [navigation],
  );

  // Renderizado de cada tarea en la lista.
  const renderTask = useCallback(
    ({ item }: { item: TaskSchema }) => (
      <TaskItem task={item} onToggle={toggleTask} onPress={handleTaskPress} />
    ),
    [toggleTask, handleTaskPress],
  );

  // Clave unica para cada tarea.
  const keyExtractor = useCallback((item: TaskSchema) => String(item.id), []);

  // Componente que se muestra cuando no hay tareas en la categoría seleccionada.
  const ListEmpty = () => {
    if (isSyncing) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>No hay tareas en esta categoría</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Mis Tareas</Text>
          <Text style={styles.headerSubtitle}>
            {totalCount} {totalCount === 1 ? 'tarea' : 'tareas'} en total
          </Text>
        </View>
        {isSyncing && <ActivityIndicator color="#4A90D9" size="small" />}
      </View>

      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      <FlatList
        data={tasks as unknown as TaskSchema[]}
        renderItem={renderTask}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmpty}
        refreshControl={
          <RefreshControl
            refreshing={isSyncing}
            onRefresh={syncTasks}
            tintColor="#4A90D9"
            colors={['#4A90D9']}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A2E',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#ABABAB',
    fontWeight: '500',
  },
});

export default TaskDashboard;

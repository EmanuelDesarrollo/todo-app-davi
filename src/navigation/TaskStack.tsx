import { createStackNavigator } from '@react-navigation/stack';
import TaskDashboard from '../features/tasks/view/TaskDashboard';
import TaskDetail from '../features/tasks/view/TaskDetail';
import { TaskStackParamList } from './types';

const Stack = createStackNavigator<TaskStackParamList>();

const TaskStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TaskDashboard" component={TaskDashboard} />
            <Stack.Screen name="TaskDetail" component={TaskDetail} />
        </Stack.Navigator>
    );
};

export default TaskStack;

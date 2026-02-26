import { createStackNavigator } from '@react-navigation/stack';
import TaskDashboard from '../features/tasks/view/TaskDashboard';

const Stack = createStackNavigator();

const TaskStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TaskDashboard" component={TaskDashboard} />
        </Stack.Navigator>
    );
};

export default TaskStack;

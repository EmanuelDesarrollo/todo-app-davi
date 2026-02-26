import { LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { RealmProvider } from '@realm/react';
import { TaskSchema } from './storage/TaskSchema';
import TaskStack from './navigation/TaskStack';

LogBox.ignoreLogs([
  'InteractionManager has been deprecated',
  'RCTScrollViewComponentView implements focusItemsInRect',
]);

export default function App() {
  return (
    <RealmProvider schema={[TaskSchema]}>
      <NavigationContainer>
        <TaskStack />
      </NavigationContainer>
    </RealmProvider>
  );
}

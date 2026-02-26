import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { TaskSchema } from '../storage/TaskSchema';

interface TaskItemProps {
  task: TaskSchema;
  onToggle: (id: number) => void;
}

const TaskItem = ({ task, onToggle }: TaskItemProps) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleToggle = useCallback(() => {
    scale.value = withSpring(0.97, { damping: 15 }, () => {
      scale.value = withSpring(1, { damping: 15 });
    });
    onToggle(task.id);
  }, [task.id, onToggle, scale]);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.textContainer}>
        <Text
          style={[styles.taskTitle, task.completed && styles.completedTitle]}
          numberOfLines={2}
        >
          {task.todo}
        </Text>
        <Text style={styles.userLabel}>User #{task.userId}</Text>
      </View>
      <TouchableOpacity onPress={handleToggle} activeOpacity={0.7} style={styles.checkboxWrapper}>
        <View style={[styles.checkbox, task.completed && styles.checkboxChecked]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: 12,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1A1A2E',
    lineHeight: 21,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9E9E9E',
  },
  userLabel: {
    fontSize: 12,
    color: '#ABABAB',
    marginTop: 4,
  },
  checkboxWrapper: {
    padding: 4,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C5C5C5',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default TaskItem;

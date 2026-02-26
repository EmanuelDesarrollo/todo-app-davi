import React from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackScreenProps } from '@react-navigation/stack';
import { TaskStackParamList } from '../../../navigation/types';
import { useTaskDetailViewModel } from '../viewModel/useTaskDetailViewModel';

type Props = StackScreenProps<TaskStackParamList, 'TaskDetail'>;

const TaskDetail = ({ route, navigation }: Props) => {

	// Id de la tarea pasado por los parametros de navegación.
	const { taskId } = route.params;
	// Obtener la tarea y acción de toggle desde el viewModel de detalle.
	const { task, toggleTask } = useTaskDetailViewModel(taskId);

	if (!task) {
		// Si no se encuentra la tarea (ej. fue eliminada), mostrar mensaje de no encontrado.
		return (
			<SafeAreaView style={styles.safeArea}>
				<View style={styles.notFound}>
					<Text style={styles.notFoundText}>Tarea no encontrada</Text>
				</View>
			</SafeAreaView>
		);
	}

	return (
		<SafeAreaView style={styles.safeArea}>
			{/* Header */}
			<View style={styles.header}>
				<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
					<Text style={styles.backArrow}>‹</Text>
					<Text style={styles.backLabel}>Volver</Text>
				</TouchableOpacity>
				<Text style={styles.headerTitle}>Detalle</Text>
				<View style={styles.headerSpacer} />
			</View>

			<ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

				{/* User Card */}
				<View style={styles.userCard}>
					{/* Avatar placeholder — integrar componente nativo aquí */}
					<View style={styles.avatar}>
						<Text style={styles.avatarText}>AV</Text>
					</View>
					<Text style={styles.userName}>
						{task.userName ?? `Usuario #${task.userId}`}
					</Text>
					<View style={styles.userIdBadge}>
						<Text style={styles.userIdText}>ID de usuario: {task.userId}</Text>
					</View>
				</View>

				{/* Task Info Card */}
				<View style={styles.card}>
					<Text style={styles.sectionLabel}>TAREA</Text>
					<Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
						{task.todo}
					</Text>
					<View style={styles.divider} />
					<View style={styles.metaRow}>
						<View style={styles.metaItem}>
							<Text style={styles.metaLabel}>ID</Text>
							<Text style={styles.metaValue}>#{task.id}</Text>
						</View>
						<View style={styles.metaItem}>
							<Text style={styles.metaLabel}>ESTADO</Text>
							<View style={[styles.statusBadge, task.completed ? styles.statusDone : styles.statusPending]}>
								<Text style={[styles.statusText, task.completed ? styles.statusTextDone : styles.statusTextPending]}>
									{task.completed ? '✓  Completada' : '●  Pendiente'}
								</Text>
							</View>
						</View>
					</View>
				</View>

				{/* Completion Toggle Button */}
				<TouchableOpacity
					style={[styles.toggleButton, task.completed ? styles.toggleButtonUndo : styles.toggleButtonComplete]}
					onPress={toggleTask}
					activeOpacity={0.8}
				>
					<Text style={[styles.toggleButtonText, task.completed && styles.toggleButtonTextUndo]}>
						{task.completed ? '↩  Marcar como pendiente' : '✓  Marcar como completada'}
					</Text>
				</TouchableOpacity>

			</ScrollView>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
		backgroundColor: '#F4F6F9',
	},

	/* Header */
	header: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		paddingHorizontal: 16,
		paddingVertical: 12,
		backgroundColor: '#F4F6F9',
	},
	backButton: {
		flexDirection: 'row',
		alignItems: 'center',
		minWidth: 70,
	},
	backArrow: {
		fontSize: 32,
		color: '#4A90D9',
		lineHeight: 34,
		marginRight: 2,
	},
	backLabel: {
		fontSize: 16,
		color: '#4A90D9',
		fontWeight: '500',
	},
	headerTitle: {
		fontSize: 17,
		fontWeight: '700',
		color: '#1A1A2E',
		letterSpacing: 0.2,
	},
	headerSpacer: {
		minWidth: 70,
	},

	/* Scroll */
	scrollContent: {
		paddingHorizontal: 16,
		paddingTop: 12,
		paddingBottom: 36,
	},

	/* User Card */
	userCard: {
		backgroundColor: '#FFFFFF',
		borderRadius: 18,
		alignItems: 'center',
		paddingVertical: 28,
		paddingHorizontal: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 8,
		elevation: 3,
	},
	avatar: {
		width: 84,
		height: 84,
		borderRadius: 42,
		backgroundColor: '#4A90D9',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 14,
		shadowColor: '#4A90D9',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 5,
	},
	avatarText: {
		fontSize: 26,
		fontWeight: '800',
		color: '#FFFFFF',
		letterSpacing: 1,
	},
	userName: {
		fontSize: 20,
		fontWeight: '700',
		color: '#1A1A2E',
		marginBottom: 8,
		textAlign: 'center',
	},
	userIdBadge: {
		backgroundColor: '#EEF4FC',
		borderRadius: 20,
		paddingHorizontal: 14,
		paddingVertical: 5,
	},
	userIdText: {
		fontSize: 12,
		color: '#4A90D9',
		fontWeight: '600',
	},

	/* Task Info Card */
	card: {
		backgroundColor: '#FFFFFF',
		borderRadius: 18,
		padding: 20,
		marginBottom: 16,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.07,
		shadowRadius: 8,
		elevation: 3,
	},
	sectionLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#ABABAB',
		letterSpacing: 1.2,
		marginBottom: 10,
	},
	taskTitle: {
		fontSize: 18,
		fontWeight: '600',
		color: '#1A1A2E',
		lineHeight: 26,
	},
	taskTitleCompleted: {
		textDecorationLine: 'line-through',
		color: '#ABABAB',
	},
	divider: {
		height: 1,
		backgroundColor: '#F0F0F0',
		marginVertical: 16,
	},
	metaRow: {
		flexDirection: 'row',
		gap: 24,
	},
	metaItem: {
		flex: 1,
	},
	metaLabel: {
		fontSize: 11,
		fontWeight: '700',
		color: '#ABABAB',
		letterSpacing: 1.2,
		marginBottom: 8,
	},
	metaValue: {
		fontSize: 16,
		fontWeight: '700',
		color: '#1A1A2E',
	},
	statusBadge: {
		borderRadius: 20,
		paddingHorizontal: 12,
		paddingVertical: 5,
		alignSelf: 'flex-start',
	},
	statusDone: {
		backgroundColor: '#E6F7EE',
	},
	statusPending: {
		backgroundColor: '#FFF3E0',
	},
	statusText: {
		fontSize: 13,
		fontWeight: '600',
	},
	statusTextDone: {
		color: '#27AE60',
	},
	statusTextPending: {
		color: '#F39C12',
	},

	/* Toggle Button */
	toggleButton: {
		borderRadius: 14,
		paddingVertical: 16,
		alignItems: 'center',
		justifyContent: 'center',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 6,
		elevation: 4,
	},
	toggleButtonComplete: {
		backgroundColor: '#4A90D9',
		shadowColor: '#4A90D9',
	},
	toggleButtonUndo: {
		backgroundColor: '#F0F0F0',
		shadowColor: '#000',
		shadowOpacity: 0.08,
	},
	toggleButtonText: {
		fontSize: 16,
		fontWeight: '700',
		color: '#FFFFFF',
	},
	toggleButtonTextUndo: {
		color: '#555555',
	},

	/* Not found */
	notFound: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
	},
	notFoundText: {
		fontSize: 16,
		color: '#ABABAB',
	},
});

export default TaskDetail;

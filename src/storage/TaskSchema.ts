import Realm from 'realm';

export class TaskSchema extends Realm.Object<TaskSchema> {
  id!: number;
  todo!: string;
  completed!: boolean;
  userId!: number;
  userName?: string;

  static schema: Realm.ObjectSchema = {
    name: 'Task',
    primaryKey: 'id',
    properties: {
      id: 'int',
      todo: 'string',
      completed: 'bool',
      userId: 'int',
      userName: 'string?',
    },
  };
}

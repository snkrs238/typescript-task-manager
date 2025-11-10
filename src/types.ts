export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
}

export interface TaskStore {
  tasks: Task[];
  nextId: number;
}

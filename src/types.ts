/**
 * Task interface representing a single task item
 */
export interface Task {
  /** Unique identifier for the task */
  id: number;
  /** Title/description of the task */
  title: string;
  /** Completion status */
  completed: boolean;
  /** Task creation timestamp */
  createdAt: Date;
  /** Task completion timestamp (optional) */
  completedAt?: Date;
}

/**
 * Task store interface for persistence
 */
export interface TaskStore {
  /** Array of all tasks */
  tasks: Task[];
  /** Next available task ID */
  nextId: number;
}

/**
 * Task filter options
 */
export enum TaskFilter {
  ALL = 'all',
  COMPLETED = 'completed',
  PENDING = 'pending',
}

/**
 * Result type for operations that may fail
 */
export interface Result<T, E = Error> {
  success: boolean;
  data?: T;
  error?: E;
}

/**
 * Storage interface for dependency injection
 */
export interface ITaskStorage {
  load(): Promise<TaskStore>;
  save(store: TaskStore): Promise<void>;
}

/**
 * Task manager interface
 */
export interface ITaskManager {
  addTask(title: string): Promise<Result<Task>>;
  deleteTask(id: number): Promise<Result<boolean>>;
  toggleTask(id: number): Promise<Result<Task>>;
  getAllTasks(filter?: TaskFilter): Promise<Result<Task[]>>;
  clearCompleted(): Promise<Result<number>>;
}

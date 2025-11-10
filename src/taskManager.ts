import { Task, TaskFilter, Result, ITaskManager, ITaskStorage } from './types';

/**
 * Task Manager class implementing business logic
 * Uses dependency injection for storage
 */
export class TaskManager implements ITaskManager {
  constructor(private readonly storage: ITaskStorage) {}

  /**
   * Validates task title
   * @param title - The task title to validate
   * @returns True if valid, false otherwise
   */
  private validateTitle(title: string): boolean {
    return title.trim().length > 0 && title.length <= 500;
  }

  /**
   * Adds a new task
   * @param title - The task title
   * @returns Result containing the new task or error
   */
  async addTask(title: string): Promise<Result<Task>> {
    try {
      if (!this.validateTitle(title)) {
        return {
          success: false,
          error: new Error('Task title must be between 1 and 500 characters'),
        };
      }

      const store = await this.storage.load();
      const newTask: Task = {
        id: store.nextId,
        title: title.trim(),
        completed: false,
        createdAt: new Date(),
      };

      store.tasks.push(newTask);
      store.nextId++;
      await this.storage.save(store);

      return { success: true, data: newTask };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }

  /**
   * Deletes a task by ID
   * @param id - The task ID to delete
   * @returns Result containing success status or error
   */
  async deleteTask(id: number): Promise<Result<boolean>> {
    try {
      const store = await this.storage.load();
      const index = store.tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        return {
          success: false,
          error: new Error(`Task with ID ${id} not found`),
        };
      }

      store.tasks.splice(index, 1);
      await this.storage.save(store);

      return { success: true, data: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }

  /**
   * Toggles task completion status
   * @param id - The task ID to toggle
   * @returns Result containing the updated task or error
   */
  async toggleTask(id: number): Promise<Result<Task>> {
    try {
      const store = await this.storage.load();
      const task = store.tasks.find((t) => t.id === id);

      if (!task) {
        return {
          success: false,
          error: new Error(`Task with ID ${id} not found`),
        };
      }

      task.completed = !task.completed;
      task.completedAt = task.completed ? new Date() : undefined;
      await this.storage.save(store);

      return { success: true, data: task };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }

  /**
   * Gets all tasks with optional filtering
   * @param filter - Filter type (all, completed, pending)
   * @returns Result containing filtered tasks or error
   */
  async getAllTasks(filter: TaskFilter = TaskFilter.ALL): Promise<Result<Task[]>> {
    try {
      const store = await this.storage.load();
      let tasks = store.tasks;

      switch (filter) {
        case TaskFilter.COMPLETED:
          tasks = tasks.filter((t) => t.completed);
          break;
        case TaskFilter.PENDING:
          tasks = tasks.filter((t) => !t.completed);
          break;
        case TaskFilter.ALL:
        default:
          break;
      }

      return { success: true, data: tasks };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }

  /**
   * Clears all completed tasks
   * @returns Result containing the number of deleted tasks or error
   */
  async clearCompleted(): Promise<Result<number>> {
    try {
      const store = await this.storage.load();
      const beforeCount = store.tasks.length;
      store.tasks = store.tasks.filter((task) => !task.completed);
      await this.storage.save(store);

      const deletedCount = beforeCount - store.tasks.length;
      return { success: true, data: deletedCount };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred'),
      };
    }
  }
}

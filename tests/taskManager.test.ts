import { TaskManager } from '../src/taskManager';
import { ITaskStorage, TaskStore, TaskFilter } from '../src/types';

/**
 * Mock storage implementation for testing
 */
class MockStorage implements ITaskStorage {
  private store: TaskStore = { tasks: [], nextId: 1 };

  async load(): Promise<TaskStore> {
    return JSON.parse(JSON.stringify(this.store));
  }

  async save(store: TaskStore): Promise<void> {
    this.store = JSON.parse(JSON.stringify(store));
  }

  reset(): void {
    this.store = { tasks: [], nextId: 1 };
  }
}

describe('TaskManager', () => {
  let taskManager: TaskManager;
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
    taskManager = new TaskManager(mockStorage);
  });

  describe('addTask', () => {
    it('should add a new task successfully', async () => {
      const result = await taskManager.addTask('Test task');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.title).toBe('Test task');
      expect(result.data?.completed).toBe(false);
      expect(result.data?.id).toBe(1);
    });

    it('should trim whitespace from task title', async () => {
      const result = await taskManager.addTask('  Test task  ');

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe('Test task');
    });

    it('should reject empty task title', async () => {
      const result = await taskManager.addTask('   ');

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('between 1 and 500 characters');
    });

    it('should reject task title over 500 characters', async () => {
      const longTitle = 'a'.repeat(501);
      const result = await taskManager.addTask(longTitle);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('between 1 and 500 characters');
    });

    it('should increment task ID for multiple tasks', async () => {
      await taskManager.addTask('Task 1');
      const result2 = await taskManager.addTask('Task 2');

      expect(result2.data?.id).toBe(2);
    });
  });

  describe('getAllTasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const result = await taskManager.getAllTasks();

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    it('should return all tasks', async () => {
      await taskManager.addTask('Task 1');
      await taskManager.addTask('Task 2');

      const result = await taskManager.getAllTasks();

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(2);
    });

    it('should filter completed tasks', async () => {
      await taskManager.addTask('Task 1');
      const task2 = await taskManager.addTask('Task 2');
      await taskManager.toggleTask(task2.data!.id);

      const result = await taskManager.getAllTasks(TaskFilter.COMPLETED);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].completed).toBe(true);
    });

    it('should filter pending tasks', async () => {
      await taskManager.addTask('Task 1');
      const task2 = await taskManager.addTask('Task 2');
      await taskManager.toggleTask(task2.data!.id);

      const result = await taskManager.getAllTasks(TaskFilter.PENDING);

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].completed).toBe(false);
    });
  });

  describe('toggleTask', () => {
    it('should toggle task completion status', async () => {
      const addResult = await taskManager.addTask('Test task');
      const taskId = addResult.data!.id;

      const result = await taskManager.toggleTask(taskId);

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(true);
      expect(result.data?.completedAt).toBeDefined();
    });

    it('should toggle task back to incomplete', async () => {
      const addResult = await taskManager.addTask('Test task');
      const taskId = addResult.data!.id;

      await taskManager.toggleTask(taskId);
      const result = await taskManager.toggleTask(taskId);

      expect(result.success).toBe(true);
      expect(result.data?.completed).toBe(false);
      expect(result.data?.completedAt).toBeUndefined();
    });

    it('should return error for non-existent task', async () => {
      const result = await taskManager.toggleTask(999);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('not found');
    });
  });

  describe('deleteTask', () => {
    it('should delete an existing task', async () => {
      const addResult = await taskManager.addTask('Test task');
      const taskId = addResult.data!.id;

      const result = await taskManager.deleteTask(taskId);

      expect(result.success).toBe(true);
      expect(result.data).toBe(true);

      const allTasks = await taskManager.getAllTasks();
      expect(allTasks.data?.length).toBe(0);
    });

    it('should return error for non-existent task', async () => {
      const result = await taskManager.deleteTask(999);

      expect(result.success).toBe(false);
      expect(result.error?.message).toContain('not found');
    });
  });

  describe('clearCompleted', () => {
    it('should clear all completed tasks', async () => {
      const task1 = await taskManager.addTask('Task 1');
      const task2 = await taskManager.addTask('Task 2');
      await taskManager.addTask('Task 3');

      await taskManager.toggleTask(task1.data!.id);
      await taskManager.toggleTask(task2.data!.id);

      const result = await taskManager.clearCompleted();

      expect(result.success).toBe(true);
      expect(result.data).toBe(2);

      const remaining = await taskManager.getAllTasks();
      expect(remaining.data?.length).toBe(1);
    });

    it('should return 0 when no completed tasks exist', async () => {
      await taskManager.addTask('Task 1');

      const result = await taskManager.clearCompleted();

      expect(result.success).toBe(true);
      expect(result.data).toBe(0);
    });
  });
});

import * as fs from 'fs/promises';
import * as path from 'path';
import { TaskStore, ITaskStorage } from './types';

/**
 * File-based storage implementation for tasks
 * Implements the ITaskStorage interface for dependency injection
 */
export class FileTaskStorage implements ITaskStorage {
  private readonly dataDir: string;
  private readonly dataFile: string;

  constructor(dataDir?: string) {
    this.dataDir =
      dataDir || path.join(process.env.HOME || process.env.USERPROFILE || '.', '.task-cli');
    this.dataFile = path.join(this.dataDir, 'tasks.json');
  }

  /**
   * Ensures the data directory exists
   */
  private async ensureDataDir(): Promise<void> {
    try {
      await fs.access(this.dataDir);
    } catch {
      await fs.mkdir(this.dataDir, { recursive: true });
    }
  }

  /**
   * Loads tasks from the file system
   * @returns Promise<TaskStore>
   */
  async load(): Promise<TaskStore> {
    await this.ensureDataDir();

    try {
      await fs.access(this.dataFile);
      const data = await fs.readFile(this.dataFile, 'utf-8');
      const store: TaskStore = JSON.parse(data);

      // Convert date strings back to Date objects
      store.tasks = store.tasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }));

      return store;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        // File doesn't exist, return empty store
        return { tasks: [], nextId: 1 };
      }
      throw new Error(`Failed to load tasks: ${(error as Error).message}`);
    }
  }

  /**
   * Saves tasks to the file system
   * @param store - The task store to save
   */
  async save(store: TaskStore): Promise<void> {
    await this.ensureDataDir();

    try {
      const data = JSON.stringify(store, null, 2);
      await fs.writeFile(this.dataFile, data, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to save tasks: ${(error as Error).message}`);
    }
  }
}

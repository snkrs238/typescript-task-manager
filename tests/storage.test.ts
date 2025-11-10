import * as fs from 'fs/promises';
import * as path from 'path';
import { FileTaskStorage } from '../src/storage';
import { TaskStore } from '../src/types';

describe('FileTaskStorage', () => {
  const testDir = path.join(__dirname, '.test-storage');
  let storage: FileTaskStorage;

  beforeEach(() => {
    storage = new FileTaskStorage(testDir);
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  describe('load', () => {
    it('should return empty store when file does not exist', async () => {
      const store = await storage.load();

      expect(store).toEqual({ tasks: [], nextId: 1 });
    });

    it('should load existing tasks from file', async () => {
      const mockStore: TaskStore = {
        tasks: [
          {
            id: 1,
            title: 'Test task',
            completed: false,
            createdAt: new Date('2025-01-01'),
          },
        ],
        nextId: 2,
      };

      await storage.save(mockStore);
      const loadedStore = await storage.load();

      expect(loadedStore.tasks.length).toBe(1);
      expect(loadedStore.tasks[0].title).toBe('Test task');
      expect(loadedStore.nextId).toBe(2);
    });

    it('should properly deserialize dates', async () => {
      const mockStore: TaskStore = {
        tasks: [
          {
            id: 1,
            title: 'Test task',
            completed: true,
            createdAt: new Date('2025-01-01'),
            completedAt: new Date('2025-01-02'),
          },
        ],
        nextId: 2,
      };

      await storage.save(mockStore);
      const loadedStore = await storage.load();

      expect(loadedStore.tasks[0].createdAt).toBeInstanceOf(Date);
      expect(loadedStore.tasks[0].completedAt).toBeInstanceOf(Date);
    });
  });

  describe('save', () => {
    it('should create directory if it does not exist', async () => {
      const mockStore: TaskStore = {
        tasks: [],
        nextId: 1,
      };

      await storage.save(mockStore);

      const dirExists = await fs
        .access(testDir)
        .then(() => true)
        .catch(() => false);
      expect(dirExists).toBe(true);
    });

    it('should save tasks to file', async () => {
      const mockStore: TaskStore = {
        tasks: [
          {
            id: 1,
            title: 'Test task',
            completed: false,
            createdAt: new Date(),
          },
        ],
        nextId: 2,
      };

      await storage.save(mockStore);

      const fileExists = await fs
        .access(path.join(testDir, 'tasks.json'))
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);
    });

    it('should overwrite existing file', async () => {
      const store1: TaskStore = { tasks: [], nextId: 1 };
      const store2: TaskStore = {
        tasks: [
          {
            id: 1,
            title: 'New task',
            completed: false,
            createdAt: new Date(),
          },
        ],
        nextId: 2,
      };

      await storage.save(store1);
      await storage.save(store2);

      const loaded = await storage.load();
      expect(loaded.tasks.length).toBe(1);
      expect(loaded.tasks[0].title).toBe('New task');
    });
  });
});

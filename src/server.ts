import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { TaskManager } from './taskManager';
import { FileTaskStorage } from './storage';
import { TaskFilter } from './types';

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize dependencies
const storage = new FileTaskStorage();
const taskManager = new TaskManager(storage);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

/**
 * API Routes
 */

// GET /api/tasks - Get all tasks with optional filter
app.get('/api/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const filter = (req.query.filter as string) || TaskFilter.ALL;
    const result = await taskManager.getAllTasks(filter as TaskFilter);

    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(500).json({ success: false, error: result.error?.message });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// POST /api/tasks - Create a new task
app.post('/api/tasks', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title } = req.body;

    if (!title) {
      res.status(400).json({ success: false, error: 'Title is required' });
      return;
    }

    const result = await taskManager.addTask(title);

    if (result.success) {
      res.status(201).json({ success: true, data: result.data });
    } else {
      res.status(400).json({ success: false, error: result.error?.message });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// PATCH /api/tasks/:id/toggle - Toggle task completion
app.patch('/api/tasks/:id/toggle', async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      res.status(400).json({ success: false, error: 'Invalid task ID' });
      return;
    }

    const result = await taskManager.toggleTask(taskId);

    if (result.success) {
      res.json({ success: true, data: result.data });
    } else {
      res.status(404).json({ success: false, error: result.error?.message });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// DELETE /api/tasks/:id - Delete a task
app.delete('/api/tasks/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      res.status(400).json({ success: false, error: 'Invalid task ID' });
      return;
    }

    const result = await taskManager.deleteTask(taskId);

    if (result.success) {
      res.json({ success: true, data: { deleted: true } });
    } else {
      res.status(404).json({ success: false, error: result.error?.message });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// DELETE /api/tasks/completed - Clear all completed tasks
app.delete('/api/tasks/completed', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await taskManager.clearCompleted();

    if (result.success) {
      res.json({ success: true, data: { deletedCount: result.data } });
    } else {
      res.status(500).json({ success: false, error: result.error?.message });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal server error',
    });
  }
});

// Serve index.html for root path
app.get('/', (req: Request, res: Response): void => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📝 Open your browser to view the Task Manager UI`);
});

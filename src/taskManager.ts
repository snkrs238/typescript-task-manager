import * as fs from 'fs';
import * as path from 'path';
import { Task, TaskStore } from './types';

const DATA_DIR = path.join(process.env.HOME || process.env.USERPROFILE || '.', '.task-cli');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

// データディレクトリの作成
function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// タスクの読み込み
export function loadTasks(): TaskStore {
  ensureDataDir();
  
  if (!fs.existsSync(DATA_FILE)) {
    return { tasks: [], nextId: 1 };
  }
  
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const store: TaskStore = JSON.parse(data);
    // Date型に変換
    store.tasks = store.tasks.map(task => ({
      ...task,
      createdAt: new Date(task.createdAt),
      completedAt: task.completedAt ? new Date(task.completedAt) : undefined
    }));
    return store;
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error);
    return { tasks: [], nextId: 1 };
  }
}

// タスクの保存
export function saveTasks(store: TaskStore): void {
  ensureDataDir();
  
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (error) {
    console.error('タスクの保存に失敗しました:', error);
  }
}

// タスクの追加
export function addTask(title: string): Task {
  const store = loadTasks();
  const newTask: Task = {
    id: store.nextId,
    title,
    completed: false,
    createdAt: new Date()
  };
  
  store.tasks.push(newTask);
  store.nextId++;
  saveTasks(store);
  
  return newTask;
}

// タスクの削除
export function deleteTask(id: number): boolean {
  const store = loadTasks();
  const index = store.tasks.findIndex(task => task.id === id);
  
  if (index === -1) {
    return false;
  }
  
  store.tasks.splice(index, 1);
  saveTasks(store);
  return true;
}

// タスクの完了/未完了の切り替え
export function toggleTask(id: number): Task | null {
  const store = loadTasks();
  const task = store.tasks.find(task => task.id === id);
  
  if (!task) {
    return null;
  }
  
  task.completed = !task.completed;
  task.completedAt = task.completed ? new Date() : undefined;
  saveTasks(store);
  
  return task;
}

// 全タスクの取得
export function getAllTasks(): Task[] {
  const store = loadTasks();
  return store.tasks;
}

// 完了済みタスクのクリア
export function clearCompleted(): number {
  const store = loadTasks();
  const beforeCount = store.tasks.length;
  store.tasks = store.tasks.filter(task => !task.completed);
  saveTasks(store);
  return beforeCount - store.tasks.length;
}

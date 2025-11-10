#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { TaskManager } from './taskManager';
import { FileTaskStorage } from './storage';
import { Task, TaskFilter } from './types';

// Initialize dependencies
const storage = new FileTaskStorage();
const taskManager = new TaskManager(storage);

const program = new Command();

// タスクの表示用ヘルパー関数
function displayTask(task: Task): void {
  const status = task.completed ? chalk.green('✓') : chalk.red('○');
  const title = task.completed ? chalk.gray(task.title) : chalk.white(task.title);
  const id = chalk.cyan(`[${task.id}]`);

  console.log(`${status} ${id} ${title}`);
}

function displayTasks(tasks: Task[]): void {
  if (tasks.length === 0) {
    console.log(chalk.yellow('タスクがありません。'));
    return;
  }

  console.log(chalk.bold('\n📝 タスク一覧:\n'));
  tasks.forEach(displayTask);

  const completed = tasks.filter((t) => t.completed).length;
  const total = tasks.length;
  console.log(chalk.gray(`\n完了: ${completed}/${total}`));
}

// プログラムの設定
program.name('task').description('シンプルなタスク管理CLI').version('1.0.0');

// タスクの追加
program
  .command('add <title...>')
  .description('新しいタスクを追加')
  .action(async (titleArray: string[]) => {
    const title = titleArray.join(' ');
    const result = await taskManager.addTask(title);

    if (result.success && result.data) {
      console.log(chalk.green('✓ タスクを追加しました:'));
      displayTask(result.data);
    } else {
      console.log(chalk.red(`✗ エラー: ${result.error?.message}`));
      process.exit(1);
    }
  });

// タスクの一覧表示
program
  .command('list')
  .alias('ls')
  .description('すべてのタスクを表示')
  .option('-a, --all', 'すべてのタスクを表示')
  .option('-c, --completed', '完了済みタスクのみ表示')
  .option('-p, --pending', '未完了タスクのみ表示')
  .action(async (options) => {
    let filter = TaskFilter.ALL;

    if (options.completed) {
      filter = TaskFilter.COMPLETED;
    } else if (options.pending) {
      filter = TaskFilter.PENDING;
    }

    const result = await taskManager.getAllTasks(filter);

    if (result.success && result.data) {
      displayTasks(result.data);
    } else {
      console.log(chalk.red(`✗ エラー: ${result.error?.message}`));
      process.exit(1);
    }
  });

// タスクの完了/未完了切り替え
program
  .command('toggle <id>')
  .alias('done')
  .description('タスクの完了/未完了を切り替え')
  .action(async (id: string) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log(chalk.red('✗ 無効なタスクIDです。'));
      process.exit(1);
    }

    const result = await taskManager.toggleTask(taskId);
    if (result.success && result.data) {
      const status = result.data.completed ? '完了' : '未完了';
      console.log(chalk.green(`✓ タスクを${status}にしました:`));
      displayTask(result.data);
    } else {
      console.log(chalk.red(`✗ ${result.error?.message}`));
      process.exit(1);
    }
  });

// タスクの削除
program
  .command('delete <id>')
  .alias('rm')
  .description('タスクを削除')
  .action(async (id: string) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log(chalk.red('✗ 無効なタスクIDです。'));
      process.exit(1);
    }

    const result = await taskManager.deleteTask(taskId);
    if (result.success) {
      console.log(chalk.green(`✓ タスクID ${taskId} を削除しました。`));
    } else {
      console.log(chalk.red(`✗ ${result.error?.message}`));
      process.exit(1);
    }
  });

// 完了済みタスクのクリア
program
  .command('clear')
  .description('完了済みタスクをすべて削除')
  .action(async () => {
    const result = await taskManager.clearCompleted();
    if (result.success && result.data !== undefined) {
      if (result.data > 0) {
        console.log(chalk.green(`✓ ${result.data}件の完了済みタスクを削除しました。`));
      } else {
        console.log(chalk.yellow('削除する完了済みタスクがありません。'));
      }
    } else {
      console.log(chalk.red(`✗ エラー: ${result.error?.message}`));
      process.exit(1);
    }
  });

// デフォルトコマンド（引数なしの場合）
if (process.argv.length === 2) {
  (async (): Promise<void> => {
    const result = await taskManager.getAllTasks();
    if (result.success && result.data) {
      displayTasks(result.data);
    } else {
      console.log(chalk.red(`✗ エラー: ${result.error?.message}`));
      process.exit(1);
    }
  })().catch((error: Error) => {
    console.log(chalk.red(`✗ 予期しないエラー: ${error.message}`));
    process.exit(1);
  });
} else {
  program.parse(process.argv);
}

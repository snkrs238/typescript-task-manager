#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import * as taskManager from './taskManager';
import { Task } from './types';

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
  
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;
  console.log(chalk.gray(`\n完了: ${completed}/${total}`));
}

// プログラムの設定
program
  .name('task')
  .description('シンプルなタスク管理CLI')
  .version('1.0.0');

// タスクの追加
program
  .command('add <title...>')
  .description('新しいタスクを追加')
  .action((titleArray: string[]) => {
    const title = titleArray.join(' ');
    const task = taskManager.addTask(title);
    console.log(chalk.green('✓ タスクを追加しました:'));
    displayTask(task);
  });

// タスクの一覧表示
program
  .command('list')
  .alias('ls')
  .description('すべてのタスクを表示')
  .option('-a, --all', 'すべてのタスクを表示')
  .option('-c, --completed', '完了済みタスクのみ表示')
  .option('-p, --pending', '未完了タスクのみ表示')
  .action((options) => {
    let tasks = taskManager.getAllTasks();
    
    if (options.completed) {
      tasks = tasks.filter(t => t.completed);
    } else if (options.pending) {
      tasks = tasks.filter(t => !t.completed);
    }
    
    displayTasks(tasks);
  });

// タスクの完了/未完了切り替え
program
  .command('toggle <id>')
  .alias('done')
  .description('タスクの完了/未完了を切り替え')
  .action((id: string) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log(chalk.red('✗ 無効なタスクIDです。'));
      return;
    }
    
    const task = taskManager.toggleTask(taskId);
    if (task) {
      const status = task.completed ? '完了' : '未完了';
      console.log(chalk.green(`✓ タスクを${status}にしました:`));
      displayTask(task);
    } else {
      console.log(chalk.red(`✗ タスクID ${taskId} が見つかりません。`));
    }
  });

// タスクの削除
program
  .command('delete <id>')
  .alias('rm')
  .description('タスクを削除')
  .action((id: string) => {
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log(chalk.red('✗ 無効なタスクIDです。'));
      return;
    }
    
    const success = taskManager.deleteTask(taskId);
    if (success) {
      console.log(chalk.green(`✓ タスクID ${taskId} を削除しました。`));
    } else {
      console.log(chalk.red(`✗ タスクID ${taskId} が見つかりません。`));
    }
  });

// 完了済みタスクのクリア
program
  .command('clear')
  .description('完了済みタスクをすべて削除')
  .action(() => {
    const count = taskManager.clearCompleted();
    if (count > 0) {
      console.log(chalk.green(`✓ ${count}件の完了済みタスクを削除しました。`));
    } else {
      console.log(chalk.yellow('削除する完了済みタスクがありません。'));
    }
  });

// デフォルトコマンド（引数なしの場合）
if (process.argv.length === 2) {
  const tasks = taskManager.getAllTasks();
  displayTasks(tasks);
} else {
  program.parse(process.argv);
}

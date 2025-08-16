import chalk from 'chalk';
import { spawn } from 'child_process';
import path from 'path';
import { ProcessTask } from './scripts.types.js';

export const startTask = (task: ProcessTask) => {
    const [command, ...args] = task.command;
    const child = spawn(command, args, {
        cwd: path.resolve(task.location),
        stdio: 'pipe',
    });

    child.stdout.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
            console.log(task.color(`[${task.name}]`) + ` ${line}`);
        }
    });

    child.stderr.on('data', (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
            console.log(chalk.red(`[${task.name}] ${line}`));
        }
    });

    child.on('close', () => {
        const children = task.after;
        if (!children) return;

        for (const task of children) {
            startTask(task);
        }
    });
};

export const startTasks = (tasks: ProcessTask[]) => {
    for (const task of tasks) {
        startTask(task);
    }
};

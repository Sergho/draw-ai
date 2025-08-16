import chalk from 'chalk';
import { ProcessTask } from './scripts.types.js';
import { startTasks } from './scripts.helpers.js';

const tasks: ProcessTask[] = [
    {
        name: 'client',
        location: 'client',
        color: chalk.yellow,
        command: ['npm', 'run', 'start'],
    },
    {
        name: 'server:build',
        location: 'server',
        color: chalk.grey,
        command: ['npm', 'run', 'build'],
        after: [
            {
                name: 'server:build',
                location: 'server',
                color: chalk.green,
                command: ['npm', 'run', 'build:watch'],
            },
            {
                name: 'server',
                location: 'server',
                color: chalk.magenta,
                command: ['npm', 'run', 'start:watch'],
            },
        ],
    },
];

startTasks(tasks);

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
        name: 'migrations:run',
        location: 'server',
        color: chalk.blue,
        command: ['npm', 'run', 'migration:run'],
        after: [
            {
                name: 'server:build',
                location: 'server',
                color: chalk.grey,
                command: ['npm', 'run', 'build'],
            },
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

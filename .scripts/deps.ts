import chalk from 'chalk';
import { ProcessTask } from './scripts.types.js';
import { startTasks } from './scripts.helpers.js';

const tasks: ProcessTask[] = [
    {
        name: 'client:deps',
        location: 'client',
        color: chalk.yellow,
        command: ['npm', 'install'],
    },
    {
        name: 'server:deps',
        location: 'server',
        color: chalk.green,
        command: ['npm', 'install'],
    },
];

startTasks(tasks);

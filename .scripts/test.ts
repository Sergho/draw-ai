import chalk from 'chalk';
import { ProcessTask } from './scripts.types.js';
import { startTasks } from './scripts.helpers.js';

const tasks: ProcessTask[] = [
    {
        name: 'migrations:run',
        location: 'server',
        color: chalk.blue,
        command: ['npm', 'run', 'migration:run'],
        after: [
            {
                name: 'server:test',
                location: 'server',
                color: chalk.green,
                command: ['npm', 'run', 'test'],
            },
        ],
    },
];

startTasks(tasks);

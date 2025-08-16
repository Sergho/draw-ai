import { ChalkInstance } from 'chalk';

export type ProcessTask = {
    name: string;
    location: string;
    command: string[];
    color: ChalkInstance;
    after?: ProcessTask[];
};

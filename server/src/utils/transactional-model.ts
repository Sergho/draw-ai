export interface TransactionalModel {
    start: () => {};
    commit: () => {};
    rollback: () => {};
}

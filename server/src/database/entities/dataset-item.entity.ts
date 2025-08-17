import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DatasetItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bytea' })
    matrix: Buffer;

    @Column({ type: 'int2' })
    value: number;
}

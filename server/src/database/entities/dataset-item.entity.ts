import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DatasetItemEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'bytea' })
    matrix: Buffer;

    @Column({ type: 'int2' })
    value: number;
}

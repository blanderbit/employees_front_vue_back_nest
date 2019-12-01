import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fio: string;

    @Column()
    dateOfBirth: string;

    @Column()
    position: string;

    @Column()
    salary: number;

}

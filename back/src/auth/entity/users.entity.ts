import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    Index,
} from 'typeorm';

@Entity()
export class Users {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Index({unique: true})
    @Column()
    email: string;

    @Column()
    password: string;
}

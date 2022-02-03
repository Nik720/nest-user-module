import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    id: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({type: 'boolean',default: true })
    isActive: boolean;
}

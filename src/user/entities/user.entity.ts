import { Exclude } from "class-transformer";
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
    @Exclude()
    password: string;

    @Column({type: 'boolean',default: true })
    isActive: boolean;

    @Column({
        nullable: true
    })
    @Exclude()
    public currentHashedRefreshToken?: string;
}

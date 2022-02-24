import { Expose } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class User {
    @PrimaryGeneratedColumn()
    @Expose()
    id: string;

    @Column()
    @Expose()
    firstname: string;

    @Column()
    @Expose()
    lastname: string;

    @Column({ unique: true })
    @Expose()
    email: string;

    @Column()
    password: string;

    @Column({type: 'boolean',default: true })
    @Expose()
    isActive: boolean;

    @Column({
        nullable: true
    })
    public currentHashedRefreshToken?: string;
}

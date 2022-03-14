import { Expose } from "class-transformer";
import PublicFile from "src/entity/publicFile.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

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

    @JoinColumn()
    @OneToOne(
        () => PublicFile,
        {
            eager: true,
            nullable: true
        }
    )
    @Expose()
    public avatar?: PublicFile
}

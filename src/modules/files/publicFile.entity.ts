import { Expose } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class PublicFile {
    @PrimaryGeneratedColumn()
    @Expose()
    public id: number;

    @Column()
    @Expose()
    public url: string;
    
    @Column()
    @Expose()
    public key: string;
}
export default PublicFile;
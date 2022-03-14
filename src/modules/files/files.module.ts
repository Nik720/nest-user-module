import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileService } from "./files.service";
import PublicFile from "../../entity/publicFile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PublicFile])
    ],
    providers: [FileService],
    exports: [FileService]
})

export class FilesModule {}
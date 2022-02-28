import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FileService } from "./files.service";
import PublicFile from "./publicFile.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PublicFile]),
        ConfigService
    ],
    providers: [FileService],
    exports: [FileService]
})

export class FilesModule {}
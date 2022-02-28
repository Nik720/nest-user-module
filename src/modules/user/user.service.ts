import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { FileService } from 'src/modules/files/files.service';

@Injectable()
export class UserService {
  private readonly logContext = UserService.name;
  private readonly logger = new Logger(UserService.name)
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>,
    private readonly fileService: FileService
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    try {
      return this.userRepository.findOne(id);
    } catch (error) {
      this.logger.error(`User is not exists with provided user id`, error.stack)
      throw new HttpException('User with this id does not exists', HttpStatus.NOT_FOUND);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto): Promise<any> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async getByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({email});
    if(user) {
      return user;
    }
    this.logger.error('User with this email does not exists', '', this.logContext);
    throw new HttpException('User with this email does not exists', HttpStatus.NOT_FOUND);
  }

  async getById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({id});
    if(user) {
      return user;
    }
    throw new HttpException('User with this id does not exists', HttpStatus.NOT_FOUND);
  }

  async setCurrentRefreshToken (refreshToken:string, userId: string): Promise<void> {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.userRepository.update(userId, { currentHashedRefreshToken });
  }

  async removeRefreshToken (userId: string): Promise<any> {
    return await this.userRepository.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async getUserIfRefreshTokenMatch(refreshToken: string, userId: string) {
    const user = await this.getById(userId);
    const isRefreshTokenMatched = await bcrypt.compare(refreshToken, user.currentHashedRefreshToken);
    if(isRefreshTokenMatched) {
      return user;
    }
  }

  async addAvatar(userId: string, imageBuffer: Buffer, fileName: string) {
    const user = await this.getById(userId);
    if (user.avatar) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null
      });
      await this.fileService.deletePublicFile(user.avatar.id);
    }
    const avatar = await this.fileService.uploadPublicFiles(imageBuffer, fileName);
    await this.userRepository.update(userId, {
      ...user,
      avatar
    });
    return avatar;
  }

  async deleteAvatar(userId: string) {
    const user = await this.getById(userId);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.userRepository.update(userId, {
        ...user,
        avatar: null
      });
      await this.fileService.deletePublicFile(fileId)
    }
  }

}

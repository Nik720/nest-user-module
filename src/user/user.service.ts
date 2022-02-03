import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import User from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) 
    private userRepository: Repository<User>
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
    return this.userRepository.findOne(id);
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
    throw new HttpException('User with this email does not exists', HttpStatus.NOT_FOUND);
  }


}

import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, UseGuards, SerializeOptions, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import JwtAuthenticationGuard from 'src/modules/authentication/guards/jwt-authentication.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import IRequestWithUser from '../authentication/interface/requestWithUser.interface';
import { Express } from 'express';

@Controller('user')
@SerializeOptions({
  strategy: 'excludeAll'
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthenticationGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.userService.remove(+id);
  }

  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: IRequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return await this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  @Delete('/img/avatar')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Req() request: IRequestWithUser) {
    try { 
      return await this.userService.deleteAvatar(request.user.id);
    } catch (error) {
      console.log(error);
    }
  }


}

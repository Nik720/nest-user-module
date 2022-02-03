import { Body, Controller, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import User from 'src/user/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import IRequestWithUser from './interface/requestWithUser.interface';

@Controller('authentication')
export class AuthenticationController {

    constructor(
        private authService: AuthenticationService
    ) {}

    @Post('register')
    @HttpCode(200)
    async register(@Body() createUserDto: RegisterDto): Promise<User> {
      return this.authService.register(createUserDto);
    }

    @Post('login')
    @UseGuards(LocalAuthenticationGuard)
    @HttpCode(200)
    async login(@Req() request: IRequestWithUser){
      const user = request.user;
      return user;
    }

}

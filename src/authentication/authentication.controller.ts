import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import User from 'src/user/entities/user.entity';
import { AuthenticationService } from './authentication.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('authentication')
export class AuthenticationController {

    constructor(
        private authService: AuthenticationService
    ) {}

    @Post('register')
    @HttpCode(200)
    register(@Body() createUserDto: RegisterDto): Promise<User> {
      return this.authService.register(createUserDto);
    }

    @Post('login')
    @HttpCode(200)
    login(@Body() logindto: LoginDto): Promise<User> {
      return this.authService.getAuthenticatedUser(logindto.email, logindto.password);
    }

}

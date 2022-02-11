import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import User from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { AuthenticationService } from './authentication.service';
import { RegisterDto } from './dto/register.dto';
import JwtAuthenticationGuard from './guards/jwt-authentication.guard';
import JwtRefreshGuard from './guards/jwt-refresh.guard';
import { LocalAuthenticationGuard } from './guards/localAuthentication.guard';
import IRequestWithUser from './interface/requestWithUser.interface';

@Controller('authentication')
export class AuthenticationController {

    constructor(
        private authService: AuthenticationService,
        private userService: UserService
    ) {}

    @Post('register')
    @HttpCode(200)
    async register(@Body() createUserDto: RegisterDto): Promise<User> {
      return this.authService.register(createUserDto);
    }

    @Post('login')
    @UseGuards(LocalAuthenticationGuard)
    @HttpCode(200)
    async login(@Req() request: IRequestWithUser, @Res() response: Response){
      const {user} = request;
      const accessTokenCookies = await this.authService.getCookiesWithJwtToken({userId: user.id, email: user.email});
      const { refreshTokenCookie, token } = await this.authService.getCookiesWithRefreshToken({userId: user.id, email: user.email});
      await this.userService.setCurrentRefreshToken(token, user.id);
      response.setHeader('Set-Cookie', [accessTokenCookies, refreshTokenCookie]);
      response.send(user);
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: IRequestWithUser, @Res() response: Response) {
      await this.userService.removeRefreshToken(request.user.id);
      response.setHeader('Set-Cookie', await this.authService.getCookiesForLogout());
      return response.sendStatus(200);
    }

    @UseGuards(JwtRefreshGuard)
    @Get('refresh')
    async refresh(@Req() request: IRequestWithUser) {
      const { refreshTokenCookie } = await this.authService.getCookiesWithRefreshToken({userId: request.user.id, email: request.user.email})
      request.res.setHeader('Set-Cookie', refreshTokenCookie);
      return request.user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Get()
    authenticate(@Req() request: IRequestWithUser) {
      const user = request.user;
      user.password = undefined;
      return user;
    }

}

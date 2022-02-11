import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthenticationService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) {}

    public async register(registrationData: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);
        try {
            const createdUser = await this.userService.create({
                ...registrationData,
                password: hashedPassword
            })
            return createdUser;
        } catch(error) {
            if(error?.code === 'ER_DUP_ENTRY') {
                throw new HttpException("Email Address is already exists", HttpStatus.BAD_REQUEST);
            }
            throw new HttpException("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAuthenticatedUser(email: string, hashedPassword: string) {
        try {
            const user = await this.userService.getByEmail(email);
            await this.verifyPassword(user.password, hashedPassword);
            return user;
        } catch (error) {
            throw new HttpException("Wrong Credential Provided", HttpStatus.BAD_REQUEST);
        }
    }

    private async verifyPassword(plainTextPassword: string, hashedPassword: string) {
        const isPasswordMatching = await bcrypt.compare(hashedPassword, plainTextPassword);
        if(!isPasswordMatching) {
            throw new HttpException("Wrong Credential Provided", HttpStatus.BAD_REQUEST);
        }
    }

    public async getCookiesWithJwtToken(tokenPayload: ITokenPayload) {
        const token = this.jwtService.sign(tokenPayload, {
            secret: this.configService.get('jwt_secret'),
            expiresIn: `${this.configService.get('jwt_expiration_time')}s`
        });
        return `Authentication=${token}; HttpOnly; path=/; Max-Age=${this.configService.get('jwt_expiration_time')}`;
    }

    public async getCookiesWithRefreshToken(tokenPayload: ITokenPayload) {
        const token = this.jwtService.sign(tokenPayload, {
            secret: this.configService.get('jwt_refresh_secret'),
            expiresIn: `${this.configService.get('jwt_refresh_expiration_time')}s`
        });
        const refreshTokenCookie = `Refresh=${token}; HttpOnly; path=/; Max-Age=${this.configService.get('jwt_refresh_expiration_time')}`;
        return {refreshTokenCookie, token}
    }

    public async getCookiesForLogout() {
        return [
            `Authentication=; HttpOnly; Path=/; Max-Age=0`,
            `Refresh=; HttpOnly; Path=/; Max-Age=0`
        ];
    }
 }

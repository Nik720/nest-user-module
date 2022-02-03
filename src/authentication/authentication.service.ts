import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthenticationService {
    constructor(
        public readonly userService: UserService
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
}

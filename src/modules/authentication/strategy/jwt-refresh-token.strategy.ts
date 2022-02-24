import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/modules/user/user.service";

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
                return request?.cookies?.Refresh
            }]),
            secretOrKey: configService.get('jwt_refresh_secret'),
            passReqToCallback: true
        })
    }

    async validate(request: Request, payload: ITokenPayload) {
        const refreshToken = request?.cookies?.Refresh;
        return await this.userService.getUserIfRefreshTokenMatch(refreshToken, payload.userId);
    }
  }
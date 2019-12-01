import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Users} from './entity/users.entity';
import {PassportModule} from '@nestjs/passport';
import {JwtModule} from '@nestjs/jwt';
import {AuthController} from './auth.controller';
import {JwtStrategy} from '../../share/strategies/jwt.startegy';
import config from '../../config/keys';

@Module({
    imports: [
        PassportModule.register({defaultStrategy: 'jwt'}),
        JwtModule.register({
            secret: config.secretKey,
            signOptions: {
                expiresIn: 3600,
            },
        }),
        TypeOrmModule.forFeature([Users]),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {
}

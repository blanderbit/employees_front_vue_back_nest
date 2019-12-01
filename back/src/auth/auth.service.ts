import { Injectable, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Users } from './entity/users.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {

    private saltRounds = 10;

    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,
        private readonly jwtService: JwtService,
    )  {}

    async register(user: CreateUserDto): Promise <object> {
        try {
            user.password = await this.getHash(user.password);
            await this.userRepository.save(user);
            return {
                message: 'Successfully registered',
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new HttpException(
                    this.setErrorData(
                        'Bad Request',
                        'Email already been taken'),
                    HttpStatus.BAD_REQUEST);
            }
            throw new HttpException({
                error: error.message,
              }, HttpStatus.BAD_REQUEST);
        }
    }

    async login({password, email}: LoginUserDto): Promise <object>{
        try {
            const response = await this.userRepository.findOne({
                email: email,
            });
            const hash = await this.compareHash(password, response.password);
            if (response && hash)  {
                const accessToken = this.jwtService.sign(JSON.parse(JSON.stringify(response)));
                return {
                    expiresIn: 3600,
                    accessToken,
                    user_id: response.id,
                    status: HttpStatus.OK,
                };
            } else {
                throw new HttpException(
                    this.setErrorData(
                    'Bad Request',
                    'please enter the correct data'),
                    HttpStatus.BAD_REQUEST,
                );

            }
        } catch (error) {
            throw new HttpException({
                error: error.message,
              }, HttpStatus.BAD_REQUEST);
        }
    }

    async validateUser(payload: LoginUserDto): Promise<any> {
        return await this.userRepository.findOne(payload.id);
    }

    async getHash(password: string | undefined): Promise<string> {
        return bcrypt.hash(password, this.saltRounds);
    }

    async compareHash(password: string | undefined, hash: string | undefined): Promise<boolean> {
        return await bcrypt.compare(password, hash);
    }

    public setErrorData(error, message) {
        return {
            error: error,
            message: [{
                constraints: {
                    WRONG_PARAMETRS: message,
                },
            }],
        };
    }
}

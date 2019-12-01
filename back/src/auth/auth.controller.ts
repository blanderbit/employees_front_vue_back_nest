import { Controller, Post, Body, Request, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ){}

    @Post('signUp')
    register(
        @Body() createUserDto: CreateUserDto,
    ): Promise<object> {
        return this.authService.register(createUserDto);
    }

    @Post('signIn')
    login(
        @Body() loginUserDto: LoginUserDto,
    ) {
        return this.authService.login(loginUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('user')
    getUser(
        @Request() req,
    ) {
        return req.user;
    }
}

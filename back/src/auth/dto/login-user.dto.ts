import {
    IsEmail,
    IsNotEmpty,
    Length,
} from 'class-validator';

export class LoginUserDto {

    id?: number;

    @IsNotEmpty()
    @Length(4)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}

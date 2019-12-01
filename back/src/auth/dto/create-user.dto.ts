import {
    IsEmail,
    IsNotEmpty,
    Length
} from 'class-validator';

export class CreateUserDto {

    readonly id?: number;

    @IsNotEmpty()
    @Length(4)
    readonly name: string;

    @IsNotEmpty()
    @Length(4)
    password: string;

    @IsEmail()
    @IsNotEmpty()
    readonly email: string;
}

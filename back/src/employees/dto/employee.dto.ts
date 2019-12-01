import {
    IsString,
    IsNumber,
    IsNotEmpty,
    Length,
} from 'class-validator';

export class CreateEmployeelDto {
    id: number;

    @IsString()
    @IsNotEmpty()
    @Length(6)
    readonly fio: string;

    @IsString()
    @IsNotEmpty()
    readonly dateOfBirth: string;

    @IsString()
    @IsNotEmpty()
    readonly position: string;

    @IsNumber()
    @IsNotEmpty()
    readonly salary: number;
}

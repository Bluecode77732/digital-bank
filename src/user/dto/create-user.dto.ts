import { Role } from '@/common/type/common.type';
import { IsString, IsEmail, MinLength, IsNotEmpty, IsEnum, IsNumber } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty()
    @IsString()
    @IsNotEmpty()
    username?: string;
    
    @IsNotEmpty()
    @IsEmail()
    @IsNotEmpty()
    email?: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password?: string;
    
    @IsNotEmpty()
    @IsEnum(Role)
    @IsNumber()
    role: number;
    
}

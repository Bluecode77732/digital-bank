import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    id!: string;
    
    @IsString()
    @IsNotEmpty()
    username!: string;
    
    @IsEmail()
    @IsNotEmpty()
    email!: string;
    
    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    password!: string;
}

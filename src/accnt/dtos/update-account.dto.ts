import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateAccountDto {
    @IsOptional()
    @IsNumber()
    readonly balance?: number;

    @IsOptional()
    @IsString()
    accountType?: string;

    @IsOptional()
    @IsString()
    status?: string;
}

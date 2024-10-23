import { IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTrscDto {
    @IsString()
    fromAccountId: string;
    
    @IsOptional()
    @IsString()
    toAccountId: string;
    
    @IsString()
    trscType!: string;

    @IsString()
    amount!: number;
}

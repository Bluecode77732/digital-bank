import { IsString, IsUUID } from "class-validator";

export class CreateTrscDto {
    @IsUUID()
    accountId: string;
    
    @IsString()
    trscType: string;

    @IsString()
    amount: number;
}

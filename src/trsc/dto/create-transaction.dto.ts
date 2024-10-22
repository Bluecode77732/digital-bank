import { IsUUID } from "class-validator";

export class CreateTrscDto {
    @IsUUID()
    accountId: string
    
}
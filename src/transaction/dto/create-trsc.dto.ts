// import { IsOptional, IsString, IsUUID } from "class-validator";

import { IsNotEmpty, IsUUID, IsNumber, IsEnum, IsOptional, Min, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// Create Transaction DTO
export class CreateTrscDto {
    @IsNotEmpty()
    @IsUUID()
    fromAccountId: string;

    @IsOptional()
    @IsUUID()
    toAccountId?: string;

    @IsNotEmpty()
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0.01)
    @Transform(({ value }) => Number(value))
    amount: number;

    @IsNotEmpty()
    @IsEnum(['withdrawal', 'deposit', 'transfer'])
    trscType: 'withdrawal' | 'deposit' | 'transfer';

    @IsOptional()
    @IsString()
    description?: string;
}

// Response DTO
export class TrscResponseDto {
    id: string;
    fromAccountId: string;
    toAccountId?: string;
    amount: number;
    trscType: 'withdrawal' | 'deposit' | 'transfer';
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Query DTO for filtering transactions
export class TrscQueryDto {
    @IsOptional()
    @IsUUID()
    accountId?: string;

    @IsOptional()
    @IsEnum(['withdrawal', 'deposit', 'transfer'])
    type?: 'withdrawal' | 'deposit' | 'transfer';

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1)
    limit?: number = 50;

    @IsOptional()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    offset?: number = 0;
}

import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  readonly accountNumber: string;

  @IsUUID()
  @IsNotEmpty()
  readonly ownerId: string;

  @IsNumber()
  @Min(0)
  readonly initialDeposit: number;

  @IsString()
  readonly accountType: string;
}

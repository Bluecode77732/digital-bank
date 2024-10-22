import { AccountModule } from '@/accnt/account.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountModule],
  providers: [Transaction],
  controllers: [],
})
export class TrscModule {}

import { AccountModule } from '@/accnt/account.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'typeorm';
import { TransactionService } from './trsc.service';
import { TrscController } from './trsc.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction]), AccountModule],
  providers: [TrscService],
  controllers: [TrscController],
})
export class TrscModule {}

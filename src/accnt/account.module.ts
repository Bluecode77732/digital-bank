import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account } from './account.entity';
import { UserModule } from '../user/..module';

@Module({
    imports: [TypeOrmModule.forFeature([Account]), UserModule],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule { }

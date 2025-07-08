import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { AccountEntity } from './account.entity';
import { UserModule } from '../user/..module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            AccountEntity
        ]), 
        UserModule
    ],
    controllers: [AccountController],
    providers: [AccountService],
})
export class AccountModule { }

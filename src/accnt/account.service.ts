import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { CreateAccountDto, UpdateAccountDto } from './dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account) private accountRepository: Repository<Account>,
        private readonly userService: UserService
    ) { }

    async create(createAccountDto: CreateAccountDto): Promise<Account> {
        const { accountNumber, ownerId, initialDeposit } = createAccountDto;
        const owner = await this.userService.findOne(ownerId);

        const account = this.accountRepository.create({
            accountNumber,
            owner,
            balance: initialDeposit,
        });

        return this.accountRepository.save(account);
    }

    async findOne(id: string): Promise<Account> {
        const account = await this.accountRepository.findOneBy({ id });
        if (!account) {
            throw new NotFoundException(`Account with ID ${id} not found`);
        }
        return account;
    }

    async update(id: string, updateAccountDto: UpdateAccountDto): Promise<Account> {
        const account = await this.findOne(id);

        if (updateAccountDto.balance !== undefined) {
            account.balance = updateAccountDto.balance;
        }

        return this.accountRepository.save(account);
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../accnt/account.entity';
import { CreateAccountDto } from './dtos/create-account.dto';
import { UpdateAccountDto } from './dtos/update-account.dto';
// import { UserService } from '../user/user.service';

@Injectable()
export class AccountService {
    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) { }

    async create(createAccountDto: CreateAccountDto) {
        const account = this.accountRepository.create(createAccountDto as Partial<Account>); // Ensure it's treated as a partial
        return await this.accountRepository.save(account); // Save to DB
    }

    findAll() {
        return this.accountRepository.find();
    }

    findOne(id: string) {
        return this.accountRepository.findOneBy({ id });
    }

    async update(id: string, updateAccountDto: UpdateAccountDto) {
        await this.accountRepository.update(id, updateAccountDto as Partial<Account>);
        return this.findOne(id);
    }

    async remove(id: string) {
        await this.accountRepository.delete(id);
        return { deleted: true };
    }
}


/* 
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
 */

/* 
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
*/
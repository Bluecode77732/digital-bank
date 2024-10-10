import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
// import { crea } from './dto/create-account.dto'; // Make sure to import this

describe('AccountService', () => {
    let service: AccountService;
    let repo: Repository<Account>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: getRepositoryToken(Account),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
        repo = module.get<Repository<Account>>(getRepositoryToken(Account));
    });

    it('should create an account', async () => {
        const createAccountDto: CreateAccountDto = {
            accountNumber: '1234567890',
            ownerId: '1',
            initialDeposit: 100,
            accountType: "",
            // Add any other required properties from CreateAccountDto
        };

        const createdAccount: Account = {
            id: '1',
            accountNumber: createAccountDto.accountNumber,
            balance: createAccountDto.initialDeposit,
            owner: createAccountDto.ownerId,
            createdAt: new Date(),
            // Add any other required properties from the Account entity
        };

        jest.spyOn(repo, 'create').mockReturnValue(createdAccount);
        jest.spyOn(repo, 'save').mockResolvedValue(createdAccount);

        const result = await service.create(createAccountDto);
        expect(result).toEqual(createdAccount);
    });

    // Additional tests for update, findAll, findOne, remove...
});


/* import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dto/create-account.dto';
 */
describe('AccountService', () => {
    let service: AccountService;
    let repo: Repository<Account>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountService,
                {
                    provide: getRepositoryToken(Account),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<AccountService>(AccountService);
        repo = module.get<Repository<Account>>(getRepositoryToken(Account));
    });

    it('should create an account', async () => {
        const createAccountDto: CreateAccountDto = {
            accountNumber: '1234567890',
            ownerId: '1',
            initialDeposit: 100,
            accountType: 'savings', // Added accountType
            // Add any other required properties from CreateAccountDto
        };

        const createdAccount: Account = {
            id: '1',
            accountNumber: createAccountDto.accountNumber,
            balance: createAccountDto.initialDeposit,
            owner: createAccountDto.ownerId,
            // accountType: createAccountDto.accountType, // Added accountType
            createdAt: new Date(),
            // Add any other required properties from the Account entity
        };

        jest.spyOn(repo, 'create').mockReturnValue(createdAccount);
        jest.spyOn(repo, 'save').mockResolvedValue(createdAccount);

        const result = await service.create(createAccountDto);
        expect(result).toEqual(createdAccount);
    });

    // Additional tests for update, findAll, findOne, remove...
});
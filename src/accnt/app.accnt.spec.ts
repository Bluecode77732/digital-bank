import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from '../accnt/account.entity';
import { User } from '../user/user.entity'; // Make sure to import User
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';
import { mock } from 'node:test';

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
            accountType: 'savings',
        };

        const mockUser: Partial<User> = {
            id: createAccountDto.ownerId,
            username: 'testuser',
            email: 'test@example.com',
            accounts: [],
        };

        const createdAccount: Partial<Account> = {
            id: '1',
            accountNumber: createAccountDto.accountNumber,
            balance: createAccountDto.initialDeposit,
            owner: mockUser as User,
            accountType: createAccountDto.accountType,
            createdAt: new Date(),
        };

        jest.spyOn(repo, 'create').mockReturnValue(createdAccount as Account);
        jest.spyOn(repo, 'save').mockResolvedValue(createdAccount as Account);

        const result = await service.create(createAccountDto);
        expect(result).toEqual(createdAccount);
    });

    // Additional tests for update, findAll, findOne, remove...
});


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
            accountType: 'savings',
            // Add any other required properties from CreateAccountDto
        };

        const mockUser: User = {
            id: createAccountDto.ownerId,
            // Add other required User properties
            username: 'testuser',
            email: 'test@example.com',
            password: 'pw123',
            accounts: [],
            trscs: [],
            firstName: '',
            lastName: '',
            role: '',
            isActive: false
        };

        const createdAccount: Account = {
            id: '1',
            accountNumber: createAccountDto.accountNumber,
            balance: createAccountDto.initialDeposit,
            owner: mockUser, // Use the mockUser object here
            accountType: createAccountDto.accountType,
            createdAt: new Date(),
            trscs: [],
        };

        jest.spyOn(repo, 'create').mockReturnValue(createdAccount);
        jest.spyOn(repo, 'save').mockResolvedValue(createdAccount);

        const result = await service.create(createAccountDto);
        expect(result).toEqual(createdAccount);
    });

    // Additional tests for update, findAll, findOne, remove...
    
    it('should return all accounts', async () => {
        const mockAccounts: Account[] = [
            { 
                id: '1',
                accountNumber: '1',
                balance: 100,
                owner: new User,
                accountType: 'savings',
                createdAt: new Date(),
                trscs: [],
            },
            { 
                id: '2',
                accountNumber: '2',
                balance: 200,
                owner: new User,
                accountType: 'checking',
                createdAt: new Date(),
                trscs: [],
            },
        ];
        
        jest.spyOn(repo, 'find')
        .mockResolvedValue(mockAccounts);
        
        const result = await service.findAll();
        expect(result).toEqual(mockAccounts);
    });

    it('should return one account by ID', async () => {
        const accntId = '3';    /* Why this one alone is a variable? */
        const mockAnAccount: Account = {
            id: accntId,
            accountNumber: '3',
            balance: 100,
            owner: new User,
            accountType: 'savings',
            createdAt : new Date(),
            trscs: [],
        }

        jest.spyOn(repo, 'findOneBy')
        .mockResolvedValue(mockAnAccount);

        const result = await service.findOne(accntId);
        expect(result).toEqual(mockAnAccount);
    });
});

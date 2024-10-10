import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { User } from '../user/user.entity'; // Make sure to import User
import { Repository } from 'typeorm';
import { CreateAccountDto } from './dtos/create-account.dto';

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
            name: 'testuser',
            email: 'test@example.com',
            accounts: []
        };

        const createdAccount: Account = {
            id: '1',
            accountNumber: createAccountDto.accountNumber,
            balance: createAccountDto.initialDeposit,
            owner: mockUser, // Use the mockUser object here
            accountType: createAccountDto.accountType,
            createdAt: new Date(),
            user: new User
        };

        jest.spyOn(repo, 'create').mockReturnValue(createdAccount);
        jest.spyOn(repo, 'save').mockResolvedValue(createdAccount);

        const result = await service.create(createAccountDto);
        expect(result).toEqual(createdAccount);
    });

    // Additional tests for update, findAll, findOne, remove...
});
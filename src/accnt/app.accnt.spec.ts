import { Test, TestingModule } from '@nestjs/testing';
import { AccountService } from './account.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account.entity';
import { Repository } from 'typeorm';

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
        const accountData = { userId: '1', initialBalance: 100, accountType: 'savings' };
        jest.spyOn(repo, 'create').mockReturnValue(accountData);
        jest.spyOn(repo, 'save').mockResolvedValue(accountData);

        const result = await service.create(accountData);
        expect(result).toEqual(accountData);
    });

    // Additional tests for update, findAll, findOne, remove...
});

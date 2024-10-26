import { Test, TestingModule } from '@nestjs/testing';
import { TrscService } from './trsc.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Trsc } from './trsc.entity';
import { Account } from '@/accnt/account.entity';

describe('TrscService', () => {
    let service: TrscService;
    let trscRepo: Repository<Trsc>;
    let accountRepo: Repository<Account>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TrscService,
                {
                    provide: getRepositoryToken(Trsc),
                    useClass: Repository,
                },
                {
                    provide: getRepositoryToken(Account),
                    useClass: Repository,
                },
                {
                    provide: DataSource,
                    useValue: {}, // Mock DataSource if not needed directly
                },
            ],
        }).compile();

        service = module.get<TrscService>(TrscService);
        trscRepo = module.get<Repository<Trsc>>(getRepositoryToken(Trsc));
        accountRepo = module.get<Repository<Account>>(getRepositoryToken(Account));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});

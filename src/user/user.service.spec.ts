import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Account } from '@/accnt/account.entity';

describe('UserService', () => {
    let service: UserService;
    let repo: Repository<User>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(User),
                    useClass: Repository,
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repo = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('should create a user', async () => {
        const user : CreateUserDto = { 
            id: '1', 
            username: 'test', 
            email: 'test@test.com', 
            password: 'password' 
        };

        jest.spyOn(repo, 'create').mockReturnValue(user as any);
        jest.spyOn(repo, 'save').mockResolvedValue(user);

        const result = await service.create(user);
        expect(result).toEqual(user);
    });

    it('should find all users', async () => {
        const users: User[] = [{ 
            id: '1', 
            username: 'test', 
            email: 'test@test.com', 
            password: 'password',
            accounts: [{
                id: '123',
                accountNumber: '456',
                balance: 789,
                createdAt:  new Date(),
                accountType: 'string',
                owner: {
                    id!:
                    username!:
                    email!:
                    password!:
                    accounts!:
                },
            }]
        }];

        jest.spyOn(repo, 'find').mockResolvedValue(users);

        const result = await service.findAll();
        expect(result).toEqual(users);
    });

    it('should find one user by ID', async () => {
        const user = { 
            id: '1', 
            username: 'test', 
            email: 'test@test.com', 
            password: 'password' 
        };

        jest.spyOn(repo, 'findOne').mockResolvedValue(user as any);

        const result = await service.findOne('1');
        expect(result).toEqual(user);
    });
});

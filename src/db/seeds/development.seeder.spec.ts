import { DataSource } from "typeorm";
import { SeederFactoryManager } from "typeorm-extension";
import { faker } from "@faker-js/faker/.";
import DevelopmentSeeder from "./development.seeder";
import { User } from "@/user/user.entity";
import { Account } from "@/accnt/account.entity";

describe('DevelopmentSeeder', () => {
    let dataSource: jest.Mocked<DataSource>;
    let factoryManager: jest.Mocked<SeederFactoryManager>;
    let userFactory: jest.Mocked<any>;
    let accountFactory: jest.Mocked<any>;
    let developmentSeeder: DevelopmentSeeder;

    beforeEach(() => {
        // Mock users for testing
        const mockUsers = Array.from({ length: 10 }, (_, index) => ({
            id: `user-${index + 1}`,
        }));

        userFactory = {
            saveMany: jest.fn().mockResolvedValue(mockUsers),
        };

        accountFactory = {
            save: jest.fn().mockResolvedValue({}),
        };

        factoryManager = {
            get: jest.fn().mockImplementation((entity) => {
                if (entity === User) return userFactory;
                if (entity === Account) return accountFactory;
            }),
        } as any;

        dataSource = {} as any;
        developmentSeeder = new DevelopmentSeeder();

        // Mock faker to return consistent results
        jest.spyOn(faker.number, 'int').mockReturnValue(2);
        jest.spyOn(faker.finance, 'accountNumber').mockReturnValue('123456');
        jest.spyOn(faker.helpers, 'arrayElement').mockReturnValue('savings');
        jest.spyOn(faker.finance, 'amount').mockReturnValue('1000');
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should create 10 users with random accounts', async () => {
        await developmentSeeder.run(dataSource, factoryManager);

        // Verify user creation
        expect(userFactory.saveMany).toHaveBeenCalledWith(10);

        // Verify account creation
        expect(accountFactory.save).toHaveBeenCalledTimes(20); // 10 users * 2 accounts per user
    });

    it('should create accounts with correct properties', async () => {
        await developmentSeeder.run(dataSource, factoryManager);

        // Verify account creation details
        const accountSaveCalls = accountFactory.save.mock.calls;
        accountSaveCalls.forEach(call => {
            const account = call[0];
            expect(account).toMatchObject({
                accountNumber: '123456',
                accountType: 'savings',
                balance: '1000',
                currency: 'USD',
                isActive: true,
            });
        });
    });
});

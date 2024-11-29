import { DataSource, Repository } from "typeorm";
import { SeederFactoryManager } from "typeorm-extension";
import AdminSeeder from "./admin.seeder";
import { User } from "@/user/user.entity";
import { Account } from "@/accnt/account.entity";

describe('AdminSeeder', () => {
    let dataSource: jest.Mocked<DataSource>;
    let factoryManager: jest.Mocked<SeederFactoryManager>;
    let userRepo: jest.Mocked<Repository<User>>;
    let accntRepo: jest.Mocked<Repository<Account>>;
    let adminSeeder: AdminSeeder;

    beforeEach(() => {
        userRepo = {
            save: jest.fn().mockResolvedValue({ id: '1', email: 'gg@bankaccnt.com' }),
        } as any;

        accntRepo = {
            save: jest.fn().mockResolvedValue({}),
        } as any;

        dataSource = {
            getRepository: jest.fn().mockImplementation((entity) => {
                if (entity === User) return userRepo;
                if (entity === Account) return accntRepo;
            }),
        } as any;

        factoryManager = {} as any;
        adminSeeder = new AdminSeeder();
    });

    it('should create an admin user and account', async () => {
        await adminSeeder.run(dataSource, factoryManager);

        // Verify user creation
        expect(userRepo.save).toHaveBeenCalledWith({
            email: 'gg@bankaccnt.com',
            password: 'pw',
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isActive: true,
        });

        // Verify account creation
        expect(accntRepo.save).toHaveBeenCalledWith({
            userId: '1',
            accntNumber: '1',
            accntType: 'admin',
            balance: 0,
            currency: 'USD',
            isActive: true,
        });
    });
});

import { DataSource } from "typeorm";
import { Seeder, SeederFactoryManager } from "typeorm-extension";
import { User } from "@/user/user.entity";
import { Account } from "@/accnt/account.entity";

export default class AdminSeeder implements Seeder {
    public async run(
        dataSource : DataSource,
        factoryManager : SeederFactoryManager,  //Define a factory for each entity for which data should be automatically generated. To create entities with random data, create a factory for each desired entity. The definition of a factory is optional.
    ) : Promise<void> {
        const userRepo = dataSource.getRepository(User);
        const accntRepo = dataSource.getRepository(Account);
        
        // Create Admin user
        const adminUser = await userRepo.save({
            email : 'gg@bankaccnt.com',
            password : 'pw',    //change pw and do not upload on github
            firstName : 'Admin',
            lastName : 'User',
            role : 'admin',
            isActive: true,
        });

        // Create admin accnt
        await accntRepo.save({
            userId: adminUser.id,   //Getting `Id` data source from the `User` repository
            accntNumber: '',
            accntType: '',
            balance: 0, //`userId` gets err when `balance`
            currency: 'USD',
            isActive : true,
        });
    }
}
